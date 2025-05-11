import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Checkbox, Form, Input, Select} from "antd";
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";
import {get} from "lodash";
import usePutQuery from "../../../hooks/api/usePatchQuery.js";

const CreateEditWarehouseSections = ({selected,setIsModalOpen}) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [active, setActive] = useState(get(selected,'active',true));
    const [trashSection, setTrashSection] = useState(get(selected,'trashSection',true));
    const [serviceSection, setServiceSection] = useState(get(selected,'serviceSection',true));

    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.warehouse_sections_list,
    });
    const { mutate:mutateEdit, isLoading:isLoadingEdit } = usePutQuery({
        listKeyId: KEYS.warehouse_sections_list,
    });

    const { data:warehouses,isLoading:isLoadingWarehouses } = useGetAllQuery({
        key: KEYS.warehouses_list,
        url: URLS.warehouses_list,
        params: {
            params: {
                size: 1000
            }
        }
    })

    useEffect(() => {
        form.setFieldsValue({
            name: get(selected,'name'),
            warehouseId: get(selected,'warehouse.id'),
        });
        setActive(get(selected,'active',true));
        setTrashSection(get(selected,'trashSection',true));
        setServiceSection(get(selected,'serviceSection',true));
    }, [selected]);

    const onFinish = (values) => {
        const formData = {
            ...values,
            active,
            trashSection,
            serviceSection,
        }
        if (selected){
            mutateEdit(
                { url: `${URLS.warehouse_sections_edit}/${get(selected,'id')}`, attributes: formData },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                    },
                }
            );
        }else {
            mutate(
                { url: URLS.warehouse_sections_add, attributes: formData },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                    },
                }
            );
        }
    };

    return (
        <>
            <Form
                onFinish={onFinish}
                autoComplete="off"
                layout={"vertical"}
                form={form}
            >
                <Form.Item
                    label={t("Warehouse")}
                    name="warehouseId"
                    rules={[{required: true,}]}>
                    <Select
                        showSearch
                        placeholder={t("Warehouse")}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                        loading={isLoadingWarehouses}
                        options={get(warehouses,'data.content')?.map((item) => {
                            return {
                                value: get(item,'id'),
                                label: get(item,'name')
                            }
                        })}
                    />
                </Form.Item>

                <Form.Item
                    label={t("Name")}
                    name="name"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="active"
                    valuePropName="active"
                >
                    <Checkbox checked={active} onChange={(e) => setActive(e.target.checked)}>{t("is active")} ?</Checkbox>
                </Form.Item>

                <Form.Item
                    name="serviceSection"
                    valuePropName="serviceSection"
                >
                    <Checkbox checked={serviceSection} onChange={(e) => setServiceSection(e.target.checked)}>{t("is service section")} ?</Checkbox>
                </Form.Item>

                <Form.Item
                    name="trashSection"
                    valuePropName="trashSection"
                >
                    <Checkbox checked={trashSection} onChange={(e) => setTrashSection(e.target.checked)}>{t("is trash section")} ?</Checkbox>
                </Form.Item>

                <Form.Item>
                    <Button block type="primary" htmlType="submit" loading={isLoading || isLoadingEdit}>
                        {selected ? t("Edit") : t("Create")}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default CreateEditWarehouseSections;
