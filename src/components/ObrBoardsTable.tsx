import React from 'react';
import { useTable, useExpanded, useBlockLayout, useResizeColumns, useGlobalFilter, useAsyncDebounce } from 'react-table';
import { Table } from 'react-bootstrap';
import FA from 'react-fontawesome';

export interface IProps {
  tableData: any;
}
function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
  }) {
    const count = preGlobalFilteredRows.length
    const [value, setValue] = React.useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
      setGlobalFilter(value || undefined)
    }, 200)
  
    return (
      <span>
        Search:{' '}
        <input
          value={value || ""}
          onChange={e => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
          placeholder={`${count} records...`}
          style={{
            fontSize: '1.1rem',
            border: '0',
          }}
        />
      </span>
    )
  }
export function ObrBoardsTable(props: IProps) {
  const { tableData } = props;
  const defaultColumn = React.useMemo(
    () => ({
      width: 250,
      maxWidth: 450
    }),
    []
  );
  const columns = React.useMemo(
    () => [
      {
        id: 'expander',
        width: 70,
        Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
          <span {...getToggleAllRowsExpandedProps()}>
            {isAllRowsExpanded ? <FA className="ml-3" name="angle-down" /> : <FA className="ml-3" name="angle-right" />}
          </span>
        ),
        Cell: ({ row }) =>
          row.canExpand ? (
            <span
              {...row.getToggleRowExpandedProps({
                style: {
                  paddingLeft: `${row.depth * 2}rem`
                }
              })}
            >
              {row.isExpanded ? <FA className="ml-3" name="angle-down" /> : <FA className="ml-3" name="angle-right" />}
            </span>
          ) : null
      },
      {
        Header: 'Objective and Key Results',
        accessor: 'title',
        width: 400,
        id: 'objective_key'
      },
      {
        Header: 'Grade',
        accessor: 'grade',
        id: 'grade'
      },
      {
        Header: 'Owner',
        id: 'assignee',
        Cell: ({ row }) => (
            <span>{`${row.original.owner.firstName} ${row.original.owner.lastName}`}</span>
        )
      },
      {
        Header: 'Status',
        accessor: 'status',
        id: 'status'
      }
    ],
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns: columns,
      data: tableData,
      defaultColumn
    },
    useBlockLayout,
    useResizeColumns,
    useGlobalFilter,
    useExpanded
  ) as any;
  return (
      <>
      <GlobalFilter
      preGlobalFilteredRows={preGlobalFilteredRows}
      globalFilter={state.globalFilter}
      setGlobalFilter={setGlobalFilter}
    />
    <Table size="sm" bordered {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
    </>
  );
}
