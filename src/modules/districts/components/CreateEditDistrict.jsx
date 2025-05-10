import React, {useEffect} from 'react';
import {useTranslation} from "react-i18next";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Form, Input, Select} from "antd";
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";
import {get} from "lodash";
import usePutQuery from "../../../hooks/api/usePatchQuery.js";

const CreateEditProduct = ({itemData,setIsModalOpen,refetch}) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();

    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.district_list,
    });
    const { mutate:mutateEdit, isLoading:isLoadingEdit } = usePutQuery({
        listKeyId: KEYS.district_list,
        hideSuccessToast: false
    });

    const { data:regions,isLoading:isLoadingRegions } = useGetAllQuery({
        key: KEYS.region_list,
        url: URLS.region_list,
        params: {
            params: {
                size: 1000
            }
        }
    })
    useEffect(() => {
        form.setFieldsValue({
            regionId: get(itemData,'regionId'),
            nameUz: get(itemData,'nameUz'),
            nameRu: get(itemData,'nameRu'),
        });
    }, [itemData]);

    const onFinish = (values) => {
        if (itemData){
            mutateEdit(
                { url: `${URLS.district_edit}/${get(itemData,'id')}`, attributes: values },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        refetch()
                    },
                }
            );
        }else {
            mutate(
                { url: URLS.district_add, attributes: values },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        refetch()
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
                    label={t("Name uz")}
                    name="nameUz"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("Name ru")}
                    name="nameRu"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("Region")}
                    name="regionId"
                    rules={[{required: true,}]}>
                    <Select
                        placeholder={t("Region")}
                        loading={isLoadingRegions}
                        options={get(regions,'data.content',[])?.map((item) => {
                            return {
                                value: get(item,'id'),
                                label: `${get(item,'nameUz')} / ${get(item,'nameRu')}`
                            }
                        })}
                    />
                </Form.Item>
                <Form.Item>
                    <Button block type="primary" htmlType="submit" loading={isLoading || isLoadingEdit}>
                        {itemData ? t("Edit") : t("Create")}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default CreateEditProduct;
