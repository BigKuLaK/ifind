import { useTranslation } from "@translations/index";
import {
  title,
  description,
  emailPlaceholder,
  emailButton,
} from "./translations";

import "./styles.module.scss";

const NewsLetter = () => {
  const translate = useTranslation();

  return (
    <section className="newsletter section">
      <div className="newsletter__container">
        <div className="inner-top">
          <div className="row">
            <div className="col-lg-8 offset-lg-2 col-12">
              <div className="inner">
                <h4 className="title">{translate(title)}</h4>
                <p className="ptext">{translate(description)}</p>
                <form
                  action="mail/mail.php"
                  method="get"
                  target="_blank"
                  className="newsletter-inner"
                >
                  <input
                    name="EMAIL"
                    placeholder={translate(emailPlaceholder)}
                    type="email"
                  />
                  <button className="btn">{translate(emailButton)}</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;
