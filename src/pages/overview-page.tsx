import useAxios from "axios-hooks";
import PlantCard from "../components/overview-page/plant-card";
import {Plant} from "../models/Plant";
import {ActionIcon, Center, Loader, Space, Stack} from "@mantine/core";
import React, {useState} from "react";
import DescriptionPage from "./description-page";
import PlantModal from "../components/plant-modal";
import classes from "./overview-page.module.css";
import {CirclePlus} from "tabler-icons-react";
import {useParams} from "react-router-dom";
import {backendUrl} from "../global";


export default function OverviewPage() {
    const {user} = useParams()
    const [{data, loading, error}, refetch] = useAxios({
        url: backendUrl + '/plant',
        method: 'GET',
        params: {
            user: user
        }
    });
    const [
        {data: postData, loading: postLoading, error: postError},
        executePost
    ] = useAxios(
        {
            url: backendUrl + '/plant',
            method: 'POST',
        },
        {manual: true}
    )

    const [description, setDescription] = useState(<div/>)
    const [showDescription, setShowDescription] = useState(false)
    const [opened, setOpened] = useState(false);

    let content = <Center><Loader variant="dots"/></Center>
    let emptyPlant: Plant = {
        alias: "",
        id: 0,
        infos: "",
        lightBadge: "",
        lightDescription: "",
        moistBadge: "",
        moistDescription: "",
        name: "",
        waterBadge: "",
        waterDescription: "",
        imageName: "",
        userName: user,
        date: new Date()
    }

    function setOverview() {
        content = <Stack>
            {loading && <Center><Loader variant="dots"/></Center>}
            {!loading && <div>
                <PlantModal opened={opened} onClose={() => setOpened(false)} plant={emptyPlant}
                            onSubmit={(plant, file) => {
                                const formData = new FormData();
                                if (file) {
                                    formData.append("image", file)
                                }
                                formData.append("data", JSON.stringify(plant))
                                executePost({data: formData})
                                reload()
                            }
                            }/>
                {!opened && <div className={classes.buttonContainer}>
                    <ActionIcon color="teal" size="xl" onClick={() => setOpened(true)}>
                        <CirclePlus size={200}/>
                    </ActionIcon>
                </div>}
                {data.map((plant: Plant, index: number) => {
                    return (
                        <div>
                            <PlantCard key={plant.id * 1000} plant={plant}
                                       click={() => clickHandler(plant)} reload={reload}/>
                            <Space key={index} h="xs"/>
                        </div>
                    )
                })}
            </div>}
        </Stack>
    }

    function back() {
        setShowDescription(false)
    }

    function clickHandler(plant: Plant) {
        setShowDescription(true);
        setDescription(<DescriptionPage click={back} plant={plant} refetch={refetch}
                                        showDescription={setShowDescription}/>)
    }

    function reload() {
        if (!postLoading) {
            setTimeout(function () {
                refetch()
            }, 1000)
        }
    }

    if (!loading) {
        setOverview();
    }

    return (
        <div>
            {!showDescription && content}
            {showDescription && description}
        </div>

    )
}
