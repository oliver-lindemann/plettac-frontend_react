import PulseLoader from 'react-spinners/PulseLoader'

const CenteredPulseLoader = () => {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", minHeight: "100vh" }}>
            <PulseLoader color={"#E32027"} />
        </div>
    );
}

export default CenteredPulseLoader