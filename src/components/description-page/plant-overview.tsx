import React from 'react';
import {Center, Grid, Image, Paper, Text} from "@mantine/core";
import classes from './plant-overview.module.css'
import {Plant} from "../../models/Plant";
import BadgesDisplay from "../badges-display";
import {backendUrl} from "../../global";

export default function PlantOverview(props: Plant) {
    const imageUrl = backendUrl + '/images/' + props.imageName
    return (
        <Paper withBorder shadow="md" radius="md" p="lg" className={classes.container}>
            <Grid>
                <Grid.Col span={7}>
                    <Text color="#1d401d" size="xl" weight={700}>{props.alias}</Text>
                    <Text color="#1d401d">{props.name}</Text>
                    <BadgesDisplay plant={props} isOverview={false}/>
                </Grid.Col>
                <Grid.Col span={5}>
                    <Center>
                        <Image width={130} fit="cover" radius="lg" src={imageUrl}/>
                    </Center>
                </Grid.Col>
            </Grid>
        </Paper>
    )
}
