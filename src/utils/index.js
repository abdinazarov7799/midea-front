export const getStatusColor = (status) => {
    switch (status) {
        case 'CREATED': return '#1387df';
        case 'COMPLETED': return '#34cd07';
        case 'REJECTED_BY_WAREHOUSE_WORKER': return '#ea1919';
        case 'RETURNED_AND_COMPLETED': return '#ea1919';
        case 'RETURNING': return '#ea8819';
        default: return '#fff5cc';
    }
}
