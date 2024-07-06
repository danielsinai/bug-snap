import React, { useMemo } from "react";
import Select from "../../components/inputs/Select";
import useSelectedSource from "../../hooks/useSelectedSource";
import useSources from "../../hooks/useSources";

function SelectSource() {
    const { videoSources } = useSources();
    const { setSelectedSource, selectedSource } = useSelectedSource();

    const options = useMemo(() => videoSources.map((source) => ({ label: source.name, value: source.id })), [videoSources]);

    return (
        <>
            <h2 className="text-lg font-semibold">Select Source</h2>
            <Select options={options} value={selectedSource} onChange={(e) => setSelectedSource(e.target.value)} />
        </>
    )
}

export default SelectSource;