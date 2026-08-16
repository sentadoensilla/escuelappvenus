
import { Link } from 'react-router-dom';
/* eslint-disable react/prop-types */
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from 'react-data-table-component';

export default function Listado({props}){
    const pagOpt = props.pagOpt || {
        rowsPerPageText: 'Filas por página',
        rangeSeparatorText: true,
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Todos'
    };
    
    if(props.data.length > 0){
        return ( 
            <div>
                <DataTable 
                    columns={props.columns}
                    data={props.data}
                    responsive={true}
                    striped={true}
                    highlightOnHover
                    pagination={pagOpt}
                />
                {
                    (props.link)?
                        <div className="text-right">
                            <Link className='btn btn-success' to={props.link}>Más...</Link>
                        </div>
                    :
                    ""
                }
            </div>
        )
    }else{
        return (
            <div>
                <h2 className='text-center text-danger'>Sin datos</h2>
            </div>
        )
    }
}