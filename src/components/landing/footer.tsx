import { JSX } from "react";
import { Logo } from "@/helpers/icons";
import { JSX } from "react";

const FooterBottom = (): JSX.Element => {
    return (
        <section className="footer-bottom relative z-20 w-full">
            <Logo className="mx-auto size-full w-full px-14 py-14" />
        </section>
    );
};

export default FooterBottom;

const Footer = (): JSX.Element => {
    const { t } = useTranslation("home", { keyPrefix: "footer" });

    return (
        <footer className="footer relative mt-12 w-full font-medium">
            <div className="relative w-full">
                <FooterTop />

                <div className="footer__copyright relative z-20 container flex w-full justify-between px-5 text-primary/70">
                    <p>{t("footerText")}</p>
                    <p>Trimobe</p>
                </div>

                <hr className="relative z-20 mt-5" />

                <FooterBottom />

                <img
                    src="/gradient.svg"
                    className="absolute right-0 bottom-0 z-10 h-[27%] w-full md:h-[70%] lg:h-[76%] xl:h-[85%]"
                />
            </div>
        </footer>
    );
};

export default Footer;