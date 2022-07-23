import React, {MouseEventHandler, useState} from 'react';
import PlantOverview from "../components/description-page/plant-overview";
import PlantDescription from "../components/description-page/plant-description";
import {ActionIcon, Space} from "@mantine/core";
import {ArrowBack, Pencil} from "tabler-icons-react";
import classes from "./description-page.module.css"
import {Plant} from "../models/Plant";
import PlantModal from "../components/plant-modal";
import useAxios from "axios-hooks";
import {backendUrl} from "../global";

interface descriptionProps {
    plant: Plant,
    click: MouseEventHandler,
    refetch: any,
    showDescription: any
}

export default function DescriptionPage({plant, click, refetch, showDescription}: descriptionProps) {
    const [opened, setOpened] = useState(false);
    const [
        {data: putData, loading: putLoading, error: putError},
        executePut
    ] = useAxios(
        {
            url: backendUrl + '/plant',
            method: 'PUT'
        },
        {manual: true}
    )

    return (
        <div>
            <PlantModal opened={opened} onClose={() => setOpened(false)} plant={plant}
                        onSubmit={(newPlant, file) => {
                            const formData = new FormData();
                            if (file) {
                                formData.append("image", file)
                            }
                            formData.append("data", JSON.stringify(newPlant))
                            executePut({data: formData})
                            showDescription(false)
                            if (!putLoading) {
                                setTimeout(function () {
                                    console.log("refetch")
                                    refetch()
                                }, 1000)
                            }
                        }}/>
            <div className={classes.actionIconContainer}>
                <ActionIcon onClick={click}><ArrowBack color="#1d401d"/></ActionIcon>
                <ActionIcon onClick={() => setOpened(true)}><Pencil color="#1d401d"/></ActionIcon>
            </div>
            <Space h="md"/>
            <PlantOverview{...plant}/>
            <Space h="md"/>
            <PlantDescription {...plant}/>
        </div>
    )
}
