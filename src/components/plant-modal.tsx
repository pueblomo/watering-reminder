import {
    Button,
    Center,
    Group,
    MantineTheme,
    Modal,
    Stack,
    Text,
    Textarea,
    TextInput,
    useMantineTheme
} from "@mantine/core";
import {Plant} from "../models/Plant";
import {z} from 'zod';
import {useForm, zodResolver} from "@mantine/form";
import {Dropzone, DropzoneStatus, IMAGE_MIME_TYPE} from "@mantine/dropzone";
import {Icon as TablerIcon, Photo, Upload, X} from "tabler-icons-react";
import {useState} from "react";
import {backendUrl} from "../global";
import Resizer from "react-image-file-resizer";

interface modalProps {
    opened: boolean,
    onClose: () => void,
    plant: Plant,
    onSubmit: (plant: Plant, file: File | undefined) => void
}

const errorMin = 'Mindestens 2 Zeichen';
const errorMax = 'Maximal 15 Zeichen'

const schema = z.object({
    alias: z.string().min(2, {message: errorMin}),
    name: z.string().min(2, {message: errorMin}),
    lightBadge: z.string().min(2, {message: errorMin}).max(15, {message: errorMax}),
    waterBadge: z.string().min(2, {message: errorMin}).max(15, {message: errorMax}),
    moistBadge: z.string().min(2, {message: errorMin}).max(15, {message: errorMax}),
})

function getIconColor(status: DropzoneStatus, theme: MantineTheme) {
    return status.accepted
        ? theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]
        : status.rejected
            ? theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]
            : theme.colorScheme === 'dark'
                ? theme.colors.dark[0]
                : theme.colors.gray[7];
}

function ImageUploadIcon({
                             status,
                             ...props
                         }: React.ComponentProps<TablerIcon> & { status: DropzoneStatus }) {
    if (status.accepted) {
        return <Upload {...props} />;
    }

    if (status.rejected) {
        return <X {...props} />;
    }

    return <Photo {...props} />;
}

export const dropzoneChildren = (status: DropzoneStatus, theme: MantineTheme) => (
    <Group position="center" spacing="xs" style={{minHeight: 100, pointerEvents: 'none'}}>
        <ImageUploadIcon status={status} style={{color: getIconColor(status, theme)}} size={40}/>

        <div>
            <Text size="md" inline>
                Drag image here or click to select file
            </Text>
            <Text size="sm" color="dimmed" inline mt={7}>
                File should not exceed 5mb
            </Text>
        </div>
    </Group>
);

export default function PlantModal({opened, onClose, plant, onSubmit}: modalProps) {
    const theme = useMantineTheme();
    const [file, setFile] = useState<File>();
    const form = useForm({
        schema: zodResolver(schema),
        initialValues: {
            id: plant.id,
            alias: plant.alias,
            name: plant.name,
            infos: plant.infos,
            lightBadge: plant.lightBadge,
            lightDescription: plant.lightDescription,
            waterBadge: plant.waterBadge,
            waterDescription: plant.waterDescription,
            moistBadge: plant.moistBadge,
            moistDescription: plant.moistDescription,
            imageName: plant.imageName,
            userName: plant.userName,
            date: plant.date
        }
    })

    function showImage() {
        if (!file && plant.imageName === "") {
            return (<br/>)
        }
        if (file) {
            const src = URL.createObjectURL(file)
            return (
                <Center>
                    <img width={130} src={src}/>
                </Center>
            )
        } else {
            return (
                <Center>
                    <img width={130} src={backendUrl + '/images' + plant.imageName}/>
                </Center>
            )
        }
    }

    // @ts-ignore
    return (
        <Modal opened={opened} onClose={onClose}>
            <form onSubmit={form.onSubmit((values) => {
                plant = {...values, imageName: plant.imageName}
                onSubmit({
                    ...values,
                    imageName: plant.imageName
                }, file)
                onClose()

            })}>
                <Stack>
                    <TextInput
                        required
                        label="Alias"
                        {...form.getInputProps('alias')}
                    />
                    <TextInput
                        required
                        label="Name"
                        {...form.getInputProps('name')}
                    />
                    <Textarea
                        label="Infos"
                        autosize
                        {...form.getInputProps('infos')}
                    />
                    <TextInput
                        required
                        label="Licht Badge"
                        {...form.getInputProps('lightBadge')}
                    />
                    <Textarea
                        label="Licht Beschreibung"
                        autosize
                        {...form.getInputProps('lightDescription')}
                    />
                    <TextInput
                        required
                        label="Wasser Badge"
                        {...form.getInputProps('waterBadge')}
                    />
                    <Textarea
                        label="Wasser Beschreibung"
                        autosize
                        {...form.getInputProps('waterDescription')}
                    />
                    <TextInput
                        required
                        label="Feuchtigkeit Badge"
                        {...form.getInputProps('moistBadge')}
                    />
                    <Textarea
                        label="Feuchtigkeit Beschreibung"
                        autosize
                        {...form.getInputProps('moistDescription')}
                    />
                    {showImage()}
                    <Dropzone onDrop={async (files) => {
                        try {
                            Resizer.imageFileResizer(
                                files[0],
                                130,
                                130,
                                "JPEG",
                                70,
                                0,
                                (dataURI) => {
                                    // @ts-ignore
                                    setFile(dataURI);
                                },
                                "file"
                            );
                        } catch (err) {
                            console.log(err);
                        }
                    }}
                              onReject={(files) => console.log('rejected files', files)}
                              accept={IMAGE_MIME_TYPE}>
                        {(status) => dropzoneChildren(status, theme)}
                    </Dropzone>
                    <Button type="submit">Submit</Button>
                </Stack>
            </form>
        </Modal>
    )
}
