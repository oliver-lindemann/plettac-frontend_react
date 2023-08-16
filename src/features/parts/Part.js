import { useState, useRef, useEffect } from 'react'
import { getPartImages, partImagessUrlEndpoint } from '../../app/api/partsApi';
import CenteredPulseLoader from '../../components/loading/CenteredPulseLoader'
import PartImageCarousel from '../../components/modal/parts/PartImageCarousel';

import QRCode from 'qrcode';
import { useParams } from 'react-router-dom';
import usePart from '../../hooks/parts/usePart';
import DefaultContainer from '../../components/layout/DefaultContainer';
import { Button, Card, CardActions, CardContent, Grid, Typography } from '@mui/material';


const Part = () => {

    const { id } = useParams();
    const { part } = usePart(id);

    const [images, setImages] = useState([]);
    const canvasRef = useRef();
    const downloadLinkRef = useRef();

    useEffect(() => {
        const getImages = async () => {
            const response = await getPartImages([partImagessUrlEndpoint, part._id]);
            console.log(response);
            if (!response
                || !response.imageFiles
                || response.imageFiles.length <= 0) {
                return;
            }

            setImages(response.imageFiles)
            QRCode.toCanvas(
                canvasRef.current,
                part.articleNr || '',
                {
                    width: 512,
                    height: 512
                },
                (error) => {
                    if (error) {
                        console.log(error);
                    }
                })
        }

        if (!!part) {
            getImages(part);
        }
    }, [part]);

    const handleDownloadQrCode = () => {
        const link = downloadLinkRef.current;
        link.href = canvasRef.current.toDataURL();
        link.download = `${part?.articleNr}_qr.png`;
        link.click();
    }

    if (!part) {
        return <CenteredPulseLoader />
    }

    return (
        <DefaultContainer>
            <Grid
                container
                spacing={2}
                direction='row'
            >
                <Card>
                    <CardContent>
                        <Typography>Informationen über das Bauteil</Typography>
                        {part.name}
                        <br />
                        {part.articleNr}
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <canvas ref={canvasRef} />
                    </CardContent>
                    <CardActions>
                        <Button onClick={handleDownloadQrCode}>Herunterladen</Button>
                        <a href="#" ref={downloadLinkRef} hidden />
                    </CardActions>
                </Card>

                <Card>
                    <PartImageCarousel
                        part={part}
                        images={images} />
                </Card>
            </Grid>
        </DefaultContainer>
    )
}

export default Part