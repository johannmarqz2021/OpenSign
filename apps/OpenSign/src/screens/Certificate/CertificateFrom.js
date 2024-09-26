import React from 'react';
import { connect } from 'react-redux';
import { withFormik, Field, Form, getIn } from 'formik';
import * as Yup from 'yup';
import { Button, Row, Col } from 'react-bootstrap';
import FormikInput from '../../components/utils/input/FormikInput';
import { FormikDatePicker, UploadFile } from '../../components/utils/input';
import { t } from 'i18next';
import '../../services/yupCustomMethods';

const CertifcateFrom = ({ onHide, submitVariant, errors, touched, isSubmitting, setFieldValue }) => {
    return (
        <>
            <h1 className="text-[20px] font-semibold mb-4">
                {t('certificate')}
            </h1>
            <p className="text-sm font-medium mb-2.5">
                {t('info-certificate')}
            </p>
            <Form>
                <Row>
                    <Col md={12}>
                        <Field name="file">
                            {({ field }) => (
                                <UploadFile
                                    {...field}
                                    abbr
                                    label={`${t("report-heading.Certificate")} (${t("certificate-type")})`}
                                    error={getIn(errors, field.name)}
                                    touched={getIn(touched, field.name)}
                                    onChange={file => setFieldValue(field.name, file)}
                                    inputType="file"
                                    formats={[".p12", ".pfx"]}
                                />
                            )}
                        </Field>
                    </Col>
                    <Col className='mt-2' md={12}>
                        <Field name="password">
                            {({ field }) => (
                                <FormikInput
                                    {...field}
                                    abbr
                                    inputType="password"
                                    label={t("password")}
                                    error={getIn(errors, field.name)}
                                    touched={getIn(touched, field.name)}
                                />
                            )}
                        </Field>
                    </Col>
                    <Col className='mt-2' md={12}>
                        <Field name="passwordConfirmation">
                            {({ field }) => (
                                <FormikInput
                                    {...field}
                                    abbr
                                    inputType="password"
                                    label={t("confirm-password")}
                                    error={getIn(errors, field.name)}
                                    touched={getIn(touched, field.name)}
                                />
                            )}
                        </Field>
                    </Col>
                    <Col className='mt-2' md={12}>
                        <Field name="date">
                            {({ field }) => (
                                <FormikDatePicker
                                    {...field}
                                    abbr
                                    isOutsideRange={() => false}
                                    label={t("report-heading.expiration-date")}
                                    placeholderText="dd/mm/aaaa"
                                    error={getIn(errors, field.name)}
                                    touched={getIn(touched, field.name)}

                                />
                            )}
                        </Field>
                    </Col>
                </Row>
                <p className="text-xs font-medium mt-2.5 mb-2.5">
                    {t('info-date-expiration')}
                </p>
                <div className="pt-3  md:ml-0">
                    <Button type="submit" className="op-btn op-btn-primary" variant={submitVariant} disabled={isSubmitting} onClick={onHide}>
                        {t("save")}
                    </Button>
                </div>
            </Form>
        </>
    );
};
const setInitialValues = () => {
    return {
        file: null,
        password: null,
        passwordConfirmation: null,
        date: null
    };
};

const validationSchema = Yup.object().shape({
    file: Yup.mixed()
        .required(t("validations.certificate.required.file"))
        .isCertificate(t('validations.file-type', {fileType: '.p12 y .pfx'})),
    password: Yup.string()
        .required(t("validations.certificate.required.password"))
        .min(6, t("validations.min-6")),
    passwordConfirmation: Yup.string()
        .required(t("validations.certificate.required.passwordConfirmation"))
        .min(6, t("validations.min-6"))
        .oneOf([Yup.ref('password'), null], t("validations.certificate.confirm.password")),
    date: Yup.string().required(t("validations.certificate.required.date")),
});

const handleSubmit = (values, { props, setSubmitting, setFieldValue }) => {
    const { formRequest } = props;
    formRequest(values, setSubmitting, setFieldValue);
};

export default withFormik({
    mapPropsToValues: setInitialValues,
    validationSchema,
    handleSubmit,
    enableReinitialize: true,
    validateOnMount: false
})(connect()(CertifcateFrom));
