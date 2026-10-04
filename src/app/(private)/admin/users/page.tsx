"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Search,
  Shield,
  ShieldCheck,
  UserPlus,
  UserRound,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HudPanel } from "@/components/ui/hud-panel";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { ROLES } from "@/guards/roles";
import { useRoleGuard } from "@/guards/role-guard";
import { cn } from "@/lib/utils";
import {
  assignRoleToUser,
  createUser,
  fetchRoles,
  fetchUsers,
  getRoleErrorMessage,
} from "@/services/rbac/users-service";
import type { RbacUser, RoleEntity, UserStatus } from "@/services/rbac/types";
import { AccountDetailSheet } from "./account-detail-sheet";

type Feedback = { kind: "success" | "error"; message: string } | null;

function getInitials(email?: string | null) {
  if (!email) return "?";
  const localPart = email.split("@")[0];
  return localPart.slice(0, 2).toUpperCase();
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const STATUS_META: Record<UserStatus, { label: string; className: string }> = {
  active: {
    label: "Actif",
    className:
      "hud-chip bg-[var(--dg-success)]/15 text-[var(--dg-success)] border border-[var(--dg-success-border)]",
  },
  pending: {
    label: "En attente",
    className:
      "hud-chip bg-[var(--dg-text-muted)]/15 text-[var(--dg-text-muted)] border border-[var(--dg-border)]",
  },
  suspended: {
    label: "Suspendu",
    className:
      "hud-chip bg-[var(--dg-danger-soft)] text-[var(--dg-danger)] border border-[var(--dg-danger-border)]",
  },
  locked: {
    label: "Verrouillé",
    className:
      "hud-chip bg-[var(--dg-danger-soft)] text-[var(--dg-danger)] border border-[var(--dg-danger-border)]",
  },
  deleted: {
    label: "Supprimé",
    className:
      "hud-chip bg-[var(--dg-danger-soft)] text-[var(--dg-danger)] border border-[var(--dg-danger-border)]",
  },
};

function statusMeta(status: string) {
  return STATUS_META[status as UserStatus] ?? STATUS_META.pending;
}

function roleBadge(roleName: string, isSuperAdmin: boolean) {
  return (
    <Badge
      className={cn(
        "border hud-chip",
        isSuperAdmin
          ? "bg-[var(--dg-accent)]/15 text-[var(--dg-accent-bright)] border-[var(--dg-accent)]/40 shadow-[0_0_10px_var(--dg-accent-glow)]"
          : "bg-[var(--dg-bg-card-hover)] text-[var(--dg-text-muted)] border-[var(--dg-border-strong)]",
      )}
    >
      {roleName.replaceAll("_", " ")}
    </Badge>
  );
}

function roleLabel(role: RoleEntity) {
  return role.name.replaceAll("_", " ");
}

function PageSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-64 bg-white/10" />
        <Skeleton className="h-3.5 w-96 bg-white/10" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-24 rounded-2xl bg-white/10" />
        ))}
      </div>
      <Skeleton className="h-16 rounded-2xl bg-white/10" />
      <Skeleton className="h-16 rounded-2xl bg-white/10" />
      <Skeleton className="h-16 rounded-2xl bg-white/10" />
    </div>
  );
}

function AccessDenied() {
  return (
    <HudPanel
      tone="danger"
      className="flex flex-col items-center justify-center gap-4 p-10"
    >
      <Shield className="h-12 w-12 text-[var(--dg-danger)]" />
      <h2 className="text-lg font-semibold text-[var(--dg-text)]">
        Accès refusé
      </h2>
      <p className="max-w-md text-center text-sm text-[var(--dg-text-muted)]">
        Cette section est réservée au super administrateur du Haut Conseil de
        Terra Nova.
      </p>
    </HudPanel>
  );
}

export default function AdminUsersPage() {
  const { isLoading: rolesLoading, hasRole } = useRoleGuard();
  const [users, setUsers] = useState<RbacUser[]>([]);
  const [roles, setRoles] = useState<RoleEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [selectedUser, setSelectedUser] = useState<RbacUser | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const refresh = async () => {
    setLoading(true);
    setError(false);
    try {
      const [usersData, rolesData] = await Promise.all([
        fetchUsers(),
        fetchRoles(),
      ]);
      setUsers(usersData);
      setRoles(rolesData);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [usersData, rolesData] = await Promise.all([
          fetchUsers(),
          fetchRoles(),
        ]);
        if (cancelled) return;
        setUsers(usersData);
        setRoles(rolesData);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 5000);
    return () => clearTimeout(timer);
  }, [feedback]);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((user) =>
      user.email.toLowerCase().includes(q) ||
      (user.firstName ?? "").toLowerCase().includes(q) ||
      (user.lastName ?? "").toLowerCase().includes(q),
    );
  }, [users, query]);

  if (rolesLoading) return <PageSkeleton />;
  if (!hasRole(ROLES.ADMIN)) return <AccessDenied />;

  return (
    <div className="flex flex-col gap-4 p-6">
      <header>
        <p className="dg-eyebrow">Haut Conseil · Administration</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--dg-text)]">
          Gestion des utilisateurs
        </h1>
        <p className="mt-1 text-sm text-[var(--dg-text-muted)]">
          Consultez les comptes de Terra Nova et attribuez des rôles aux
          habitants et aux agents.
        </p>
      </header>

      {feedback && (
        <div
          role="status"
          className={cn(
            "flex items-center gap-2 rounded-xl border px-4 py-3 text-sm backdrop-blur",
            feedback.kind === "success"
              ? "border-[var(--dg-success-border)] bg-[var(--dg-success-soft)] text-[var(--dg-success)]"
              : "border-[var(--dg-danger-border)] bg-[var(--dg-danger-soft)] text-[var(--dg-danger)]",
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              feedback.kind === "success"
                ? "bg-[var(--dg-success)] shadow-[0_0_8px_var(--dg-success-glow)]"
                : "bg-[var(--dg-danger)]",
            )}
          />
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          label="Utilisateurs"
          value={users.length}
          icon={<UserRound className="h-4 w-4" />}
        />
        <StatCard
          label="Comptes actifs"
          value={users.filter((u) => u.status === "active").length}
          icon={<ShieldCheck className="h-4 w-4" />}
        />
        <StatCard
          label="Rôles définis"
          value={roles.length}
          icon={<Shield className="h-4 w-4" />}
        />
      </div>

      <HudPanel edge className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--dg-text-faint)]" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher par email ou nom…"
              className="pl-9!"
              aria-label="Rechercher un utilisateur"
            />
          </div>
          <Button
            onClick={() => setShowCreate(true)}
            className="dg-btn-accent"
          >
            <UserPlus className="h-4 w-4" />
            Nouvel utilisateur
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-16 rounded-xl bg-white/10" />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-sm text-[var(--dg-text-muted)]">
              Impossible de charger les utilisateurs.
            </p>
            <Button variant="outline" onClick={() => void refresh()}>
              Réessayer
            </Button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-10 text-center text-sm text-[var(--dg-text-muted)]">
            Aucun utilisateur trouvé.
          </div>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {filteredUsers.map((user) => (
              <li
                key={user.id}
                className="hud-cut flex flex-wrap items-center gap-3 border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 py-3 backdrop-blur transition-colors hover:border-[var(--dg-border-strong)] hover:bg-[var(--dg-bg-card-hover)]"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src="" alt={user.email} />
                  <AvatarFallback className="rounded-xl! bg-[var(--dg-accent)]/25 text-[var(--dg-accent-bright)]">
                    {getInitials(user.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-medium text-white">
                    {user.email}
                  </p>
                  <p className="text-[11px] text-[var(--dg-text-faint)]">
                    Inscrit le {formatDate(user.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge className={statusMeta(user.status).className}>
                    {statusMeta(user.status).label}
                  </Badge>
                  {user.userRoles
                    ?.map((ur) => ur.role)
                    .filter((role) => role)
                    .slice(0, 2)
                    .map((role) => (
                      <span key={role!.id}>
                        {roleBadge(role!.name, role!.isSuperAdmin)}
                      </span>
                    ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedUser(user)}
                  className="cursor-pointer border border-[var(--dg-border)] text-[var(--dg-text-muted)] hover:border-[var(--dg-accent)]/40 hover:text-[var(--dg-accent-bright)]"
                >
                  Gérer les rôles
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedAccountId(user.id)}
                  className="cursor-pointer border border-[var(--dg-border)] text-[var(--dg-text-muted)] hover:border-[var(--dg-accent)]/40 hover:text-[var(--dg-accent-bright)]"
                >
                  Compte
                </Button>
              </li>
            ))}
          </ul>
        )}
      </HudPanel>

      {selectedUser && (
        <RoleAssignmentSheet
          user={selectedUser}
          roles={roles}
          onClose={() => setSelectedUser(null)}
          onAssigned={(count) => {
            setSelectedUser(null);
            setFeedback({
              kind: "success",
              message:
                count > 0
                  ? `${count} rôle(s) attribué(s) à ${selectedUser.email}.`
                  : "Aucun nouveau rôle sélectionné.",
            });
            void refresh();
          }}
          onError={(message) => {
            setFeedback({ kind: "error", message });
          }}
        />
      )}

      {selectedAccountId && (
        <AccountDetailSheet
          userId={selectedAccountId}
          onClose={() => setSelectedAccountId(null)}
          onChanged={() => void refresh()}
          onError={(message) => setFeedback({ kind: "error", message })}
        />
      )}

      {showCreate && (
        <CreateUserSheet
          roles={roles}
          onClose={() => setShowCreate(false)}
          onCreated={(email) => {
            setShowCreate(false);
            setFeedback({
              kind: "success",
              message: `Utilisateur ${email} créé avec succès.`,
            });
            void refresh();
          }}
          onError={(message) => {
            setFeedback({ kind: "error", message });
          }}
        />
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: ReactNode;
}) {
  return (
    <HudPanel className="flex items-center gap-3 p-4">
      <span className="hud-cut flex size-9 shrink-0 items-center justify-center bg-[var(--dg-accent)]/15 text-[var(--dg-accent-bright)]">
        {icon}
      </span>
      <div>
        <p className="text-2xl font-bold text-[var(--dg-text)]">{value}</p>
        <p className="text-[11px] text-[var(--dg-text-faint)]">{label}</p>
      </div>
    </HudPanel>
  );
}

function RoleCheckboxRow({
  role,
  checked,
  disabled,
  onChange,
}: {
  role: RoleEntity;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      className={cn(
        "hud-cut flex cursor-pointer items-center gap-3 border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-3 py-2.5 transition-colors hover:border-[var(--dg-border-strong)] hover:bg-[var(--dg-bg-card-hover)]",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 shrink-0 rounded accent-[var(--dg-accent)]"
      />
      <span className="min-w-0 flex-1">
        <span className="block text-[13.5px] font-medium text-white">
          {roleLabel(role)}
          {role.isSuperAdmin && (
            <span className="ml-1.5 rounded-md bg-[var(--dg-accent)]/15 px-1.5 py-0.5 text-[10px] font-semibold text-[var(--dg-accent-bright)]">
              Super admin
            </span>
          )}
        </span>
        <span className="block truncate text-[11px] text-[var(--dg-text-faint)]">
          {role.description || "—"}
        </span>
      </span>
    </label>
  );
}

function RoleAssignmentSheet({
  user,
  roles,
  onClose,
  onAssigned,
  onError,
}: {
  user: RbacUser;
  roles: RoleEntity[];
  onClose: () => void;
  onAssigned: (count: number) => void;
  onError: (message: string) => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  const assignedRoleIds = new Set(
    user.userRoles?.map((ur) => ur.roleId) ?? [],
  );
  const assignable = roles.filter((role) => !assignedRoleIds.has(role.id));
  const assigned = roles.filter((role) => assignedRoleIds.has(role.id));

  const toggle = (roleId: string) => {
    const next = new Set(selected);
    if (next.has(roleId)) next.delete(roleId);
    else next.add(roleId);
    setSelected(next);
  };

  const submit = async () => {
    if (selected.size === 0) {
      onAssigned(0);
      return;
    }
    setSubmitting(true);
    try {
      const results = await Promise.allSettled(
        [...selected].map((roleId) =>
          assignRoleToUser(user.id, { roleId }),
        ),
      );
      const failed = results.filter((r) => r.status === "rejected").length;
      if (failed > 0) {
        onError(
          `${failed} rôle(s) n'ont pas pu être attribué(s). Réessayez.`,
        );
        return;
      }
      onAssigned(selected.size);
    } catch {
      onError("Une erreur est survenue lors de l'attribution des rôles.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <SheetContent
        side="right"
        className="w-full border-none bg-[var(--dg-bg-raised)] p-0 sm:max-w-[28rem]!"
      >
        <SheetHeader>
          <SheetTitle className="text-base font-semibold text-white">
            Attribuer des rôles
          </SheetTitle>
          <SheetDescription className="text-sm text-[var(--dg-text-muted)]">
            {user.email}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4">
          <div className="hud-cut border border-[var(--dg-border)] bg-[var(--dg-bg-card)] p-3">
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--dg-text-faint)]">
              Rôles actuels
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {assigned.length === 0 && (
                <span className="text-xs text-[var(--dg-text-faint)]">
                  Aucun rôle
                </span>
              )}
              {assigned.map((role) => (
                <span key={role.id}>
                  {roleBadge(role.name, role.isSuperAdmin)}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--dg-text-faint)]">
              Rôles disponibles
            </p>
            {assignable.length === 0 ? (
              <p className="mt-2 text-xs text-[var(--dg-text-faint)]">
                Tous les rôles sont déjà attribués.
              </p>
            ) : (
              <div className="mt-2 flex flex-col gap-2">
                {assignable.map((role) => (
                  <RoleCheckboxRow
                    key={role.id}
                    role={role}
                    checked={selected.has(role.id)}
                    onChange={() => toggle(role.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {selected.has(roles.find((r) => r.isSuperAdmin)?.id ?? "") && (
            <p className="text-xs text-[var(--dg-danger)]">
              Attention : ce rôle confère tous les pouvoirs d&apos;administration.
            </p>
          )}
        </div>

        <SheetFooter>
          <Button
            onClick={() => void submit()}
            disabled={submitting || selected.size === 0}
            className="dg-btn-accent w-full"
          >
            {submitting
              ? "Attribution en cours…"
              : selected.size > 0
                ? `Attribuer ${selected.size} rôle(s)`
                : "Attribuer les rôles"}
          </Button>
          <Button variant="ghost" onClick={onClose} className="w-full">
            Fermer
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function CreateUserSheet({
  roles,
  onClose,
  onCreated,
  onError,
}: {
  roles: RoleEntity[];
  onClose: () => void;
  onCreated: (email: string) => void;
  onError: (message: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleIds, setRoleIds] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const toggleRole = (roleId: string) => {
    const next = new Set(roleIds);
    if (next.has(roleId)) next.delete(roleId);
    else next.add(roleId);
    setRoleIds(next);
  };

  const submit = async () => {
    setFormError(null);
    const trimmedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setFormError("Adresse email invalide.");
      return;
    }
    if (password.length < 8) {
      setFormError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (roleIds.size === 0) {
      setFormError("Sélectionnez au moins un rôle.");
      return;
    }
    setSubmitting(true);
    try {
      await createUser({
        email: trimmedEmail,
        password,
        roleIds: [...roleIds],
      });
      onCreated(trimmedEmail);
    } catch (error) {
      onError(
        getRoleErrorMessage(error, "Impossible de créer l'utilisateur."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <SheetContent
        side="right"
        className="w-full border-none bg-[var(--dg-bg-raised)] p-0 sm:max-w-[28rem]!"
      >
        <SheetHeader>
          <SheetTitle className="text-base font-semibold text-white">
            Nouvel utilisateur
          </SheetTitle>
          <SheetDescription className="text-sm text-[var(--dg-text-muted)]">
            Créez un compte et attribuez-lui des rôles.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--dg-text-faint)]">
              Email
            </span>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="habitant@terranova.city"
              autoComplete="email"
              aria-invalid={formError ? true : undefined}
              aria-describedby={
                formError ? "create-user-form-error" : undefined
              }
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--dg-text-faint)]">
              Mot de passe
            </span>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8 caractères minimum"
              autoComplete="new-password"
              aria-invalid={formError ? true : undefined}
              aria-describedby={
                formError ? "create-user-form-error" : undefined
              }
            />
          </label>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--dg-text-faint)]">
              Rôles
            </p>
            {roles.length === 0 ? (
              <p className="mt-2 text-xs text-[var(--dg-text-faint)]">
                Aucun rôle disponible.
              </p>
            ) : (
              <div className="mt-2 flex flex-col gap-2">
                {roles.map((role) => (
                  <RoleCheckboxRow
                    key={role.id}
                    role={role}
                    checked={roleIds.has(role.id)}
                    onChange={() => toggleRole(role.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {formError && (
            <p
              id="create-user-form-error"
              role="alert"
              className="text-xs text-[var(--dg-danger)]"
            >
              {formError}
            </p>
          )}
        </div>

        <SheetFooter>
          <Button
            onClick={() => void submit()}
            disabled={submitting}
            className="dg-btn-accent w-full"
          >
            {submitting ? "Création en cours…" : "Créer l'utilisateur"}
          </Button>
          <Button variant="ghost" onClick={onClose} className="w-full">
            Annuler
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}