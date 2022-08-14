import React, {MouseEventHandler, useState} from 'react';
import PlantOverview from "../components/description-page/plant-overview";
import PlantDescription from "../components/description-page/plant-description";
import {ActionIcon, Space} from "@mantine/core";
import {ArrowBack, Pencil, Trash} from "tabler-icons-react";
import classes from "./description-page.module.css"
import {Plant} from "../models/Plant";
import PlantModal from "../components/plant-modal";
import useAxios from "axios-hooks";
import {backendUrl} from "../global";
import {showNotification} from "@mantine/notifications";

interface descriptionProps {
    plant: Plant,
    click: MouseEventHandler,
    refetch: any
    showDescription: any
}

export default function DescriptionPage({plant, click, refetch, showDescription}: descriptionProps) {
    const [opened, setOpened] = useState(false);
    const [
        {loading: putLoading, error: putError},
        executePut
    ] = useAxios(
        {
            url: backendUrl + '/plant',
            method: 'PUT'
        },
        {manual: true}
    );

    const [
        {loading: deleteLoading, error: deleteError},
        executeDelete
    ] = useAxios(
        {
            url: backendUrl + '/plant',
            method: 'DELETE'
        },
        {manual: true}
    );

    async function deleteHandler() {
        const formData = new FormData();
        formData.append("data", JSON.stringify(plant))
        await executeDelete({data: formData})
        if (!deleteLoading) {
            if(deleteError) showNotification({message: 'Fehler beim Laden!', color: 'red'})
            showDescription(false);
            await refetch();
        }
    }

    return (
        <div>
            <PlantModal opened={opened} onClose={() => setOpened(false)} plant={plant}
                        onSubmit={async (newPlant, file) => {
                            const formData = new FormData();
                            if (file) {
                                formData.append("image", file)
                            }
                            formData.append("data", JSON.stringify(newPlant))
                            await executePut({data: formData})
                            if (!putLoading) {
                                if(putError) showNotification({message: 'Fehler beim Laden!', color: 'red'})
                                showDescription(false)
                                await refetch()
                            }
                        }}/>
            <div className={classes.actionIconContainer}>
                <ActionIcon onClick={click}><ArrowBack color="#1d401d"/></ActionIcon>
                <div className={classes.actionIconEdit}>
                    <ActionIcon onClick={() => setOpened(true)}><Pencil color="#1d401d"/></ActionIcon>
                    <ActionIcon onClick={() => deleteHandler()}><Trash color="#1d401d"/></ActionIcon>
                </div>
            </div>
            <Space h="md"/>
            <PlantOverview{...plant}/>
            <Space h="md"/>
            <PlantDescription {...plant}/>
        </div>
    )
}
