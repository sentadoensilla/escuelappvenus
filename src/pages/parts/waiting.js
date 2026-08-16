import { Fragment } from 'react';

export default function Waiting() {
	return (
        <Fragment>
            <div className="modal show" data-backdrop="static" data-keyboard="false" tabIndex="-1">
                <div className="modal-dialog modal-sm">
                    <div className="modal-content">
                        <div className="spinner-grow text-primary" role="status">
                            <span className="sr-only"> Cargando...</span>
                        </div>
                        <div className="spinner-grow text-secondary" role="status">
                            <span className="sr-only">Cargando...</span>
                        </div>
                        <div className="spinner-grow text-success" role="status">
                            <span className="sr-only">Cargando...</span>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};
