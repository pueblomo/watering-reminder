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

    let myDynamicManifest = {
        "short_name": "React App",
        "name": "Create React App Sample",
        "icons": [
            {
                "src": "favicon.ico",
                "sizes": "64x64 32x32 24x24 16x16",
                "type": "image/x-icon"
            },
            {
                "src": "logo192.png",
                "type": "image/png",
                "sizes": "192x192"
            },
            {
                "src": "logo512.png",
                "type": "image/png",
                "sizes": "512x512"
            }
        ],
        "start_url": ".",
        "display": "standalone",
        "theme_color": "#000000",
        "background_color": "#ffffff"
    }

    const stringManifest = JSON.stringify(myDynamicManifest);
    const blob = new Blob([stringManifest], {type: 'application/json'});
    const manifestURL = URL.createObjectURL(blob);
    // @ts-ignore
    document.querySelector('#my-manifest-placeholder').setAttribute('href', manifestURL);

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
