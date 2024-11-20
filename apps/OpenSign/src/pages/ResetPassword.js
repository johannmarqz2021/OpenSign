import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import login_img from "../assets/images/login_img.svg";
import Parse from "parse";
import Alert from "../primitives/Alert";
import { appInfo } from "../constant/appinfo";
import { useDispatch } from "react-redux";
import { fetchAppInfo } from "../redux/reducers/infoReducer";
import { isEnableSubscription } from "../constant/const";
import { getAppLogo } from "../constant/Utils";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const token = new URLSearchParams(window.location.search).get('token');
  const [state, setState] = useState({ hideNav: "" });
  const [newpassword, setnewpassword] = useState("");
  const [message, setMessage] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");
  const [sentStatus, setSentStatus] = useState("");
  const [image, setImage] = useState();

  const resize = () => {
    let currentHideNav = window.innerWidth <= 760;
    if (currentHideNav !== state.hideNav) {
      setState({ hideNav: currentHideNav });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newpassword !== confirmpassword) {
      setMessage(t("password-update-alert-4"))
      setSentStatus("failed");
      return;
    }
    if (!token) {
      setMessage(t("invalid-token"))
      setSentStatus("failed");
      return;
    }

    try {
      await Parse.Cloud.run("restartpassword", {
        token: token,
        password: newpassword
      });

      setSentStatus("success");
      setMessage(t("password-update-alert-1"))
      setTimeout(() => {
        navigate('/');
      }, 3000); 
    } catch (err) {
      setSentStatus("failed");
      const {code} = err
      if(code === 404){
        setMessage(t("invalid-token"))
      } else {
        setMessage(t("server-error"))
      }
    }
  };

  useEffect(() => {
    dispatch(fetchAppInfo());
    saveLogo();
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
    // eslint-disable-next-line
  }, []);

  const saveLogo = async () => {
    try {
      await Parse.User.logOut();
    } catch (err) {
      console.log("err while logging out ", err);
    }
    if (isEnableSubscription) {
      const app = await getAppLogo();
      if (app?.logo) {
        setImage(app?.logo);
      } else {
        setImage(appInfo?.applogo || undefined);
      }
    } else {
      setImage(appInfo?.applogo || undefined);
    }
  };
  return (
    <div>
      <Title title="Forgot password page" />
      {sentStatus === "success" && (
        <Alert type="success">{message}</Alert>
      )}
      {sentStatus === "failed" && (
        <Alert type={"danger"}>{message}</Alert>
      )}
      <div className="md:p-10 lg:p-16">
        <div className="md:p-4 lg:p-10 p-4 bg-base-100 text-base-content op-card">
          <div className="w-[250px] h-[66px] inline-block overflow-hidden">
            {image && (
              <img
                src={image}
                className="object-contain h-full"
                alt="applogo"
              />
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">
            <div>
              <form onSubmit={handleSubmit}>
                <h2 className="text-[30px] mt-6">{t("reset-password-alert-3")}</h2>
                <div className="w-full my-4 op-card bg-base-100 shadow-md outline outline-1 outline-slate-300/50">
                  <div className="px-6 py-4">
                    <label className="block text-xs">{t("new-password")}</label>
                    <input
                      type="password"
                      name="newpassword"
                      value={newpassword}
                      onChange={(e) => setnewpassword(e.target.value)}
                      className="op-input op-input-bordered op-input-sm text-xs w-full"
                      placeholder={t("new-password")}
                      onInvalid={(e) => e.target.setCustomValidity(t("input-required"))}
                      onInput={(e) => e.target.setCustomValidity("")}
                      required
                    />

                    <hr className="my-2 border-none" />
                    <label className="block text-xs">{t("confirm-password")}</label>
                    <input
                      type="password"
                      name="confirmpassword"
                      className="op-input op-input-bordered op-input-sm text-xs w-full"
                      value={confirmpassword}
                      onChange={(e) => setconfirmpassword(e.target.value)}
                      placeholder={t("confirm-password")}
                      onInvalid={(e) => e.target.setCustomValidity(t("input-required"))}
                      onInput={(e) => e.target.setCustomValidity("")}
                      required
                    />
                    <hr className="my-2 border-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-center text-xs font-bold">
                  <button type="submit" className="op-btn op-btn-primary">
                    {t("change-password")}
                  </button>
                </div>
              </form>
            </div>
            {!state.hideNav && (
              <div className="self-center">
                <div className="mx-auto md:w-[300px] lg:w-[500px]">
                  <img src={login_img} alt="bisec" width="100%" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
