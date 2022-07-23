import {Plant} from "../../models/Plant";
import {Avatar, Button, Center, Grid, Paper, Text} from "@mantine/core";
import classes from './plant-card.module.css'
import React, {MouseEventHandler} from "react";
import BadgesDisplay from "../badges-display";
import {Bucket} from "tabler-icons-react";
import useAxios from "axios-hooks";
import moment from "moment";
import 'moment/locale/de'
import {backendUrl} from "../../global";

interface plantCardProps {
    plant: Plant,
    click: MouseEventHandler,
    reload: () => void
}

export default function PlantCard({plant, click, reload}: plantCardProps) {
    const imageUrl = backendUrl + '/images/' + plant.imageName
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
        <Paper withBorder shadow="md" radius="md" p="lg"
               className={classes.container}>
            <Grid>
                <Grid.Col span={2} onClick={click}>
                    <Avatar radius="md" size="lg" src={imageUrl}></Avatar>
                </Grid.Col>
                <Grid.Col span={8} onClick={click}>
                    <Center>
                        <Text color="#1d401d" size="xl" weight={700}>{plant.alias}</Text>
                    </Center>
                    <Center>
                        <Text color="#1d401d">{moment(plant.date).locale('de').fromNow()}</Text>
                    </Center>
                </Grid.Col>
                <Grid.Col span={2}>
                    <Center>
                        <Button onClick={() => {
                            plant.date = new Date()
                            const formData = new FormData()
                            formData.append("data", JSON.stringify(plant))
                            executePut({data: formData})
                            reload()
                        }} variant="outline" color="teal" radius="lg"
                                styles={(theme) => ({
                                    root: {
                                        height: 56,
                                        width: 56
                                    },
                                })}>
                            <Bucket color="#1d401d" size={80}/>
                        </Button>
                    </Center>
                </Grid.Col>
                <Grid.Col onClick={click}>
                    <BadgesDisplay plant={plant} isOverview={true}/>
                </Grid.Col>
            </Grid>
        </Paper>
    )
}
