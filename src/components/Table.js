import React from 'react';
import './Table.css'

const Table = ({ countries }) => {
    return (
        <div className="table">
            {countries.map((country) => (
                <tr>
                    <td>
                        {country.country}
                    </td>
                    <td>
                        <strong>{country.cases}</strong>
                    </td>
                </tr>
            ))}
        </div>
    );
};

export default Table;