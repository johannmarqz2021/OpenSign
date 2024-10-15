import React, { useEffect, useState } from 'react'
import Loader from '../primitives/Loader';
import Alert from '../primitives/Alert';
import { t } from 'i18next';
import CertificateFrom from '../screens/Certificate/CertificateFrom';
import { SaveFileSize } from '../constant/saveFileSize';
import Parse from "parse";

const ManageCertificate = () => {
    const [isAlert, setIsAlert] = useState({
        type: "",
        message: ""
    });
    const [id, setId] = useState();
    const [isSubmit, setIsSubmit] = useState(false);
    useEffect(() => {
        fetchUserSign();
        // eslint-disable-next-line
    }, []);

    const fetchUserSign = async () => {
        const User = Parse.User.current();
        if (User) {
            const userId = {
                __type: "Pointer",
                className: "_User",
                objectId: User.id
            };
            try {
                const signCls = "contracts_Certificate";
                const signQuery = new Parse.Query(signCls);
                signQuery.equalTo("UserId", userId);
                const signRes = await signQuery.first();
                if (signRes) {
                    const res = signRes.toJSON();
                    setId(res.objectId);
                }
            } catch (err) {
                console.log("Err", err);
                alert(`${err.message}`);
            }
        }
    };

    const uploadFile = async (file) => {
        try {
            const parseFile = new Parse.File(file.name, file);
            const response = await parseFile.save();
            if (response?.url()) {
                const tenantId = localStorage.getItem("TenantId");
                SaveFileSize(file.size, response.url(), tenantId);
                return response?.url();
            }
        } catch (err) {
            console.log("sign upload err", err);
            alert(`${err.message}`);
        }
    };

    const saveCertificate = async (params, url, setFieldValue) => {
        setIsSubmit(true)
        const signCls = "contracts_Certificate";
        const User = Parse.User.current().id;
        const userId = { __type: "Pointer", className: "_User", objectId: User };
        try {
            const createCert = new Parse.Object(signCls);
            if (id) {
                createCert.id = id;
            }
            createCert.set("Password", params.password);
            createCert.set("FileURL", url);
            createCert.set("ExpirationDate", params.date);
            createCert.set("UserId", userId);
            const res = await createCert.save();
            setIsAlert({
                type: "success",
                message: t("signature-saved-alert")
            });
            setTimeout(() => setIsAlert({}), 2000);
            setFieldValue('file', null);
            setFieldValue('password', '');
            setFieldValue('passwordConfirmation', '');
            setFieldValue('date', null);
            return res;
        } catch (err) {
            setIsAlert({
                type: "danger",
                message: `${err.message}`
            });
            setTimeout(() => setIsAlert({}), 2000);
        }
    }

    const handleRequest = async (values, setSubmitting, setFieldValue) => {
        const fileUrl = await uploadFile(values.file)
        if (fileUrl) {
            saveCertificate(values, fileUrl, setFieldValue)
        }
        setSubmitting(false)
        setIsSubmit(false)
    }


    return (
        <div className="shadow-md rounded-box my-[2px] p-3 bg-base-100 text-base-content">
            {isAlert?.message && <Alert type={isAlert.type}>{isAlert.message}</Alert>}
            {isSubmit ? (
                <div className="h-[300px] flex justify-center items-center">
                    <Loader />
                </div>
            ) : (<>
                <CertificateFrom formRequest={handleRequest} />
            </>
            )}
        </div>
    )
}

export default ManageCertificate
