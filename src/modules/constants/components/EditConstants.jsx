import React, {useEffect} from 'react';
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Form, Input} from "antd";
import {useTranslation} from "react-i18next";
import {get, isEqual} from "lodash";
import usePatchQuery from "../../../hooks/api/usePatchQuery.js";
import TextArea from "antd/es/input/TextArea";

const EditConstants = ({setIsModalOpen,selected}) => {
    const {t} = useTranslation();
    const [form] = Form.useForm();

    const {mutate,isLoading} = usePatchQuery({
        listKeyId: KEYS.constants_list
    })
    const onFinish = (values) => {
        mutate(
            { url: URLS.constants_edit, attributes: values },
            {
                onSuccess: () => {
                    setIsModalOpen(false);
                },
            }
        );
    };

    useEffect(() => {
        form.setFieldsValue({
            key: get(selected,'key'),
            value: get(selected,'value'),
            comment: get(selected,'comment'),
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
                    label={t("Key")}
                    name='key'
                    rules={[{required: true,}]}
                >
                    <Input disabled/>
                </Form.Item>

                <Form.Item
                    label={t("Value")}
                    name={'value'}
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("Comment")}
                    name={'comment'}
                >
                    <TextArea />
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

export default EditConstants;
