import {Accordion, Group, Paper, ScrollArea, Text} from "@mantine/core";
import classes from "./plant-description.module.css";
import {useEffect, useState} from "react";
import {Droplet, Home, Sun, UserExclamation} from "tabler-icons-react";
import {Plant} from "../../models/Plant";

export default function PlantDescription(plant: Plant) {
    const [scrollAreaHeight, setScrollAreaHeight] = useState({
        height: window.innerHeight * 0.3
    })

    const detectSize = () => {
        setScrollAreaHeight({height: window.innerHeight * 0.3})
    }

    useEffect(() => {
        window.addEventListener('resize', detectSize)

        return () => {
            window.removeEventListener('resize', detectSize)
        }
    }, [scrollAreaHeight])

    function createLabel(label: string, icon: any) {
        return (
            <Group noWrap>
                {icon}
                <Text color="#1d401d">{label}</Text>
            </Group>
        )
    }

    function createText(text: string) {
        return (
            <Text color="#1d401d">
                {text}
            </Text>
        )
    }

    return (
        <Paper withBorder shadow="md" radius="md" p="lg" className={classes.container}>
            <Accordion iconPosition="right">
                <Accordion.Item label={createLabel("Licht", <Sun/>)}>
                    <ScrollArea style={scrollAreaHeight} type="scroll" offsetScrollbars scrollbarSize={2}>
                        <Text color="#1d401d">
                            {plant.lightDescription}
                        </Text>
                    </ScrollArea>
                </Accordion.Item>
                <Accordion.Item color="#1d401d" label={createLabel("Wasser", <Droplet color="#1d401d"/>)}>
                    <ScrollArea style={scrollAreaHeight} type="scroll" offsetScrollbars scrollbarSize={2}>
                        <Text color="#1d401d">
                            {plant.waterDescription}
                        </Text>
                    </ScrollArea>
                </Accordion.Item>
                <Accordion.Item color="#1d401d" label={createLabel("Luftfeuchtigkeit", <Home color="#1d401d"/>)}>
                    <ScrollArea style={scrollAreaHeight} type="scroll" offsetScrollbars scrollbarSize={2}>
                        <Text color="#1d401d">
                            {plant.moistDescription}
                        </Text>
                    </ScrollArea>
                </Accordion.Item>
                <Accordion.Item color="#1d401d" label={createLabel("Infos", <UserExclamation color="#1d401d"/>)}>
                    <ScrollArea style={scrollAreaHeight} type="scroll" offsetScrollbars scrollbarSize={2}>
                        {plant.infos.split("↵").map(text => createText(text))}
                    </ScrollArea>
                </Accordion.Item>
            </Accordion>
        </Paper>
    )
}
