import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import { KEYS } from "../../../constants/key.js";
import { URLS } from "../../../constants/url.js";
import { Button, Form, Input, Select } from "antd";
import { get } from "lodash";
import usePutQuery from "../../../hooks/api/usePatchQuery.js";
import TextArea from "antd/es/input/TextArea";
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";

const CreateEditCategories = ({ selected, setIsModalOpen }) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();

    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.categories_list,
    });
    const { mutate: mutateEdit, isLoading: isLoadingEdit } = usePutQuery({
        listKeyId: KEYS.categories_list,
    });

    const { data: dealers, isLoading: isLoadingDealers } = useGetAllQuery({
        key: KEYS.dealers_list,
        url: URLS.dealers_list,
        params: { params: { size: 1000 } }
    });

    useEffect(() => {
        form.setFieldsValue({
            name: get(selected, "name"),
            code: get(selected, "code"),
            description: get(selected, "description"),
            dealerIds: get(selected, "dealers")?.map((dealer) => dealer.id) || []
        });
    }, [selected]);

    const onFinish = (values) => {
        if (selected) {
            mutateEdit(
                { url: `${URLS.categories_edit}/${get(selected, "id")}`, attributes: values },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                    },
                }
            );
        } else {
            mutate(
                { url: URLS.categories_add, attributes: values },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                    },
                }
            );
        }
    };

    return (
        <Form
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            form={form}
        >
            <Form.Item
                label={t("Dealers")}
                name="dealerIds"
                rules={[{ required: true, message: t("Please select at least one dealer") }]}
            >
                <Select
                    mode="multiple"
                    placeholder={t("Select dealers")}
                    loading={isLoadingDealers}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={get(dealers, 'data.content', [])?.map((item) => ({
                        value: item.id,
                        label: item.fullName
                    }))}
                />
            </Form.Item>

            <Form.Item
                label={t("Name")}
                name="name"
                rules={[{ required: true, message: t("Name is required") }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label={t("Code")}
                name="code"
                rules={[{ required: true, message: t("Code is required") }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label={t("Description")}
                name="description"
            >
                <TextArea rows={4} />
            </Form.Item>

            <Form.Item>
                <Button
                    block
                    type="primary"
                    htmlType="submit"
                    loading={isLoading || isLoadingEdit}
                >
                    {selected ? t("Edit") : t("Create")}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CreateEditCategories;
