import React, {useEffect} from 'react';
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Form, Input, Select} from "antd";
import {useTranslation} from "react-i18next";
import {get} from "lodash";
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";
import usePutQuery from "../../../hooks/api/usePutQuery.js";

const EditDoctor = ({setSelected,selected}) => {
    const {t} = useTranslation();
    const [form] = Form.useForm();

    const {mutate,isLoading} = usePutQuery({
        listKeyId: KEYS.doctors_list
    })

    const {data:meds,isLoading:isLoadingMeds} = useGetAllQuery({
        key: KEYS.med_institutions_list,
        url: URLS.med_institutions_list,
        params: {
            params: {
                size: 1000,
            }
        },
    });

    const onFinish = (values) => {
        mutate(
            { url: `${URLS.doctor_edit}/${get(selected,'id')}`, attributes: values },
            {
                onSuccess: () => {
                    setSelected(null);
                },
            }
        );
    };

    useEffect(() => {
        form.setFieldsValue({
            fio: get(selected,'fio'),
            phone: get(selected,'phone'),
            medInstitutionId: get(selected,'medInstitutionId'),
            secondPlaceOfWork: get(selected,'secondPlaceOfWork'),
            specialization: get(selected,'specialization'),
            position: get(selected,'position'),
        });
    }, [selected]);

    return (
        <>
            <Form
                onFinish={onFinish}
                autoComplete="off"
                layout={"vertical"}
                form={form}
            >
                <Form.Item
                    label={t("FIO")}
                    name='fio'
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("Phone")}
                    name={'phone'}
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("Position")}
                    name={'position'}
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("Specialization")}
                    name={'specialization'}
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("Second place of work")}
                    name={'secondPlaceOfWork'}
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("Med institution")}
                    name="medInstitutionId"
                    rules={[{required: true,}]}>
                    <Select
                        placeholder={t("Med institution")}
                        loading={isLoadingMeds}
                        options={get(meds,'data.content',[])?.map((item) => {
                            return {
                                value: get(item,'id'),
                                label: get(item,'name'),
                            }
                        })}
                    />
                </Form.Item>

                <Form.Item>
                    <Button block type="primary" htmlType="submit" loading={isLoading}>
                        {t("Edit")}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default EditDoctor;
