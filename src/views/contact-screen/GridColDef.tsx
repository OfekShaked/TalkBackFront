import { DataGrid, GridColDef } from '@material-ui/data-grid';
import { Avatar, Button } from '@material-ui/core';
import {List} from '@material-ui/icons'
const GridColDefs = (props: any)=>{

const columns: GridColDef[] = [
    {
        field: 'username',
        headerName: 'User Name',
        width: 150,
        editable: false,
        headerAlign: 'center',
        align: 'center'
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 150,
        editable: false,
        headerAlign: 'center',
        align: 'center',
        disableColumnMenu: true,
        disableReorder: true,
        renderCell: (params) => {
            return (<>
                <Avatar className={params.row.status}> </Avatar>
            </>

            );
        }
    },
    {
        field: 'actions',
        headerName: 'Actions',
        width: 150,
        editable: false,
        headerAlign: 'center',
        align: 'center',
        disableColumnMenu: true,
        disableReorder: true,
        renderCell: (params) => {
            return (<>
                <Button aria-describedby={params.row.username} variant="contained" color="primary" onClick={props.handleClick}>
                    <List />
                </Button>
            </>

            );
        }
    }
];
return {columns}
}

export default GridColDefs;