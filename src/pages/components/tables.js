
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
    // Los dashboards pueden pasar props incompletas (p.ej. cuando la API
    // responde error con rows: {}). Nunca asumir que data es un arreglo.
    const data = Array.isArray(props.data) ? props.data : [];
    const columns = Array.isArray(props.columns) ? props.columns : [];

    if(data.length > 0){
        return ( 
            <div>
                <DataTable 
                    columns={columns}
                    data={data}
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