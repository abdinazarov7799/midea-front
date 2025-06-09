export const getStatusColor = (status) => {
    switch (status) {
        case 'CREATED': return '#7dc2ef';
        case 'COMPLETED': return '#d0ffc4';
        case 'REJECTED_BY_WAREHOUSE_WORKER': return '#ffa6a6';
        case 'RETURNED_AND_COMPLETED': return '#ffa6a6';
        case 'RETURNING': return '#ffb565';
        default: return '#fff5cc';
    }
}