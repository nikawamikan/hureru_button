type VoiceListApiResponse = {
    prefix: string,
    attrType: { [key: string]: string },
    voices: {
        name: string,
        read: string,
        address: string,
        attrIds: number[],
    }[],
};

export default VoiceListApiResponse;
