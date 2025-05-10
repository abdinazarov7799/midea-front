import React, {useEffect} from 'react';
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Form, Input, Select} from "antd";
import {useTranslation} from "react-i18next";
import {get} from "lodash";
import usePatchQuery from "../../../hooks/api/usePatchQuery.js";
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";

const EditPharmacy = ({setSelected,selected}) => {
    const {t} = useTranslation();
    const [form] = Form.useForm();

    const {mutate,isLoading} = usePatchQuery({
        listKeyId: KEYS.pharmacies_list
    })

    const {data:districts,isLoading:isLoadingDistricts} = useGetAllQuery({
        key: KEYS.district_list,
        url: URLS.district_list,
        params: {
            params: {
                size: 1000,
            }
        },
    });

    const onFinish = (values) => {
        mutate(
            { url: `${URLS.pharmacies_edit}/${get(selected,'id')}`, attributes: values },
            {
                onSuccess: () => {
                    setSelected(null);
                },
            }
        );
    };

    useEffect(() => {
        form.setFieldsValue({
            name: get(selected,'name'),
            districtId: get(selected,'districtId'),
            photoUrl: get(selected,'photoUrl'),
            inn: get(selected,'inn'),
            lat: get(selected,'lat'),
            lng: get(selected,'lng'),
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
                    label={t("Name")}
                    name='name'
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("INN")}
                    name='inn'
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("lat")}
                    name={'lat'}
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("lng")}
                    name={'lng'}
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("District")}
                    name="districtId"
                    rules={[{required: true,}]}>
                    <Select
                        placeholder={t("District")}
                        loading={isLoadingDistricts}
                        options={get(districts,'data.content',[])?.map((item) => {
                            return {
                                value: get(item,'id'),
                                label: `${get(item,'nameUz')} / ${get(item,'nameRu')}`,
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

export default EditPharmacy;
