/* eslint-disable react/prop-types */
import { Route, Routes } from 'react-router-dom';
import NoEncontrado from './notFound';

export const NotFound = ({ children }) => {
        return (
        <Routes>
                {children}
                <Route path='*' element={<NoEncontrado />} />
        </Routes>
    )
}
