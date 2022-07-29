type VoiceListApiResponse = {
    prefix: string,
    attrType: {
        id: number,
        name: string
    }[],
    voices: {
        name: string,
        read: string,
        address: string,
        attrIds: number[],
    }[],
};

export default VoiceListApiResponse;
