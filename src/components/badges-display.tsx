import {Badge, Center} from "@mantine/core";
import {Droplet, Home, Sun} from "tabler-icons-react";
import React from "react";
import {Plant} from "../models/Plant";
import classes from "./badges-display.module.css"

interface badgeProps {
    plant: Plant,
    isOverview: boolean
}


export default function BadgesDisplay({plant, isOverview}: badgeProps) {
    const dynamicStyle = isOverview ? classes.badgeContainer : classes.badgeContainerVertical
    return (
        <div className={`${dynamicStyle}`}>
            <Badge color="teal" leftSection={<Center><Sun size={15}/></Center>}>{plant.lightBadge}</Badge>
            <Badge color="teal"
                   leftSection={<Center><Droplet size={15}/></Center>}>{plant.waterBadge}</Badge>
            {!isOverview &&
                <Badge color="teal" leftSection={<Center><Home size={15}/></Center>}>{plant.moistBadge}</Badge>}
        </div>
    )
}
