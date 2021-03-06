import React, { useState } from 'react';
import { useTable, useExpanded, useFlexLayout } from 'react-table';
import { Badge, Button } from '@patternfly/react-core';
import { useQuery, useMutation, queryCache } from 'react-query';
import { AngleRightIcon, AngleDownIcon, TrashIcon, PencilAltIcon } from '@patternfly/react-icons';
import { ReactQueryConstant } from '../models/reactQueryConst';
import { deleteKeyResult, deleteObjective, getObjectives } from '../api/apis';
import { getRows } from '../utils/objectiveTableUtils';
import { addSuccessMessage, addDangerMessage } from '../utils/alertUtil';
import { formatDate } from '../utils/dateUtils';
import { ViewObjectiveDataModal } from './ViewObjectiveDataModal';

function Table({ columns: userColumns, data }) {
  const defaultColumn = React.useMemo(
    () => ({
      // When using the useFlexLayout:
      minWidth: 30, // minWidth is only used as a limit for resizing
      width: 150, // width is used for both the flex-basis and flex-grow
      maxWidth: 200 // maxWidth is only used as a limit for resizing
    }),
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
    // state: { expanded }
  } = useTable(
    {
      columns: userColumns,
      data,
      defaultColumn
    },
    useFlexLayout,
    useExpanded // Use the useExpanded plugin hook
  ) as any;

  return (
    <>
      <table className="pf-c-table pf-m-grid-md" {...getTableProps()}>
        <thead className="pf-m-nowrap">
          {headerGroups.map((headerGroup, index) => (
            <tr key={index} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, i) => (
                <th key={i} {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr key={i} {...row.getRowProps()}>
                {row.cells.map((cell, ind) => {
                  return <td key={ind} {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export interface IProps {
  onEditData: (data: any, isOpenObjectiveModal: boolean) => void;
}

function ObjectiveTable(props: IProps) {
  const { onEditData } = props;
  const [isObjectiveDataModalOpen, setIsObjectiveDataModalOpen] = useState(false);
  const [viewObjectiveData, setViewObjectiveData] = useState(null);
  const objectiveData = useQuery(ReactQueryConstant.OBJECTIVES, getObjectives, {
    staleTime: Infinity
  });
  const [dObjective] = useMutation(deleteObjective, {
    onError: () => {
      addDangerMessage('Error in deleting objective.');
    },
    onSuccess: () => {
      addSuccessMessage('Successfully Deleted Objective.');
    },
    onSettled: (data, error) => {
      queryCache.invalidateQueries(ReactQueryConstant.OBJECTIVES);
      queryCache.invalidateQueries(ReactQueryConstant.KEY_RESULTS);
    }
  });
  const [dKeyResult] = useMutation(deleteKeyResult, {
    onError: () => {
      addDangerMessage('Error in deleting Key Result.');
    },
    onSuccess: () => {
      addSuccessMessage('Successfully Deleted Key Result.');
    },
    onSettled: (data, error) => {
      queryCache.invalidateQueries(ReactQueryConstant.OBJECTIVES);
      queryCache.invalidateQueries(ReactQueryConstant.KEY_RESULTS);
    }
  });
  const columns = React.useMemo(
    () => [
      {
        // Build our expander column
        id: 'expander', // Make sure it has an ID
        Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
          <span {...getToggleAllRowsExpandedProps()}>{isAllRowsExpanded ? <AngleDownIcon /> : <AngleRightIcon />}</span>
        ),
        width: 20,
        Cell: ({ row }) => (
          // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
          // to build the toggle for expanding a row
          <span
            {...row.getToggleRowExpandedProps({
              style: {
                // We can even use the row.depth property
                // and paddingLeft to indicate the depth
                // of the row
                paddingLeft: `${row.depth * 2}rem`
              }
            })}
          >
            {!row.canExpand ? null : row.isExpanded ? <AngleDownIcon /> : <AngleRightIcon />}
          </span>
        )
      },
      {
        Header: 'Title',
        accessor: 'title',
        width: 200,
        Cell: ({ row }) => {
          // console.log('row', row);
          const { title, isObjective } = row.original;
          return (
            <span {...row.getToggleRowExpandedProps()}>
              <Badge className="m-r-2">{isObjective ? 'O' : 'KR'}</Badge>
              {title}
            </span>
          );
        }
      },
      {
        Header: 'Owner',
        id: 'owner',
        accessor: data => data?.owner?.firstName,
        width: 80
      },
      {
        Header: 'End Date',
        id: 'objective_end_date',
        accessor: data => formatDate(data.endDate),
        width: 80
      },
      {
        Header: 'Completion',
        accessor: 'completion',
        width: 80,
        Cell: ({ row }) => {
            const { completion, currentState, isObjective } = row.original;
            return (
              <span {...row.getToggleRowExpandedProps()}>
              {isObjective ? completion : currentState}
              </span>
            );
          }
      },
      {
        Header: 'Status',
        id: 'objective_status',
        accessor: data => data.status,
        width: 80
      },
      {
        id: 'actions',
        Header: 'Actions',
        width: 100,
        Cell: ({ row }) => renderActionButtons(row)
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onDeleteObjective = async (event, data) => {
    try {
      await dObjective({ id: data?.original?.id });
    } catch (error) {
        console.log('error', error);
    }
  };

  const onDeleteKeyResult = async (event, data) => {
    try {
      await dKeyResult({ id: data?.original?.id });
    } catch (error) {
        console.log('error', error);
    }
  };
  const onViewObjective = (event, data) => {
    setIsObjectiveDataModalOpen(true);
    setViewObjectiveData(data?.original || null);
  };
  const onEdit = async (event, data) => {
    onEditData && onEditData(data?.original, data?.original?.isObjective);
  };

  const renderActionButtons = row => {
    return (
      <span>
        <Button className="p-r-0 p-l-0" variant="plain" aria-label="Action" onClick={event => onEdit(event, row)}>
          <PencilAltIcon />
        </Button>
        <Button
          className="p-r-0 p-l-2"
          variant="plain"
          aria-label="Action"
          onClick={event =>
            row?.original?.isObjective ? onDeleteObjective(event, row) : onDeleteKeyResult(event, row)
          }
        >
          <TrashIcon />
        </Button>
        {row?.original?.isObjective && (
          <Button
            className="p-r-0 p-l-2"
            variant="plain"
            aria-label="Action"
            onClick={event => onViewObjective(event, row)}
          >
            <i className="fa fa-eye" />
          </Button>
        )}
      </span>
    );
  };

  // console.log("objectiveData, getRows", objectiveData, getRows());
  const data = React.useMemo(
    () => getRows(objectiveData?.data),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [objectiveData?.data]
  );

  return (
    <>
      <Table columns={columns} data={data || []} />
      <ViewObjectiveDataModal
        objectiveData={viewObjectiveData}
        onCloseModal={() => setIsObjectiveDataModalOpen(false)}
        isModalOpen={isObjectiveDataModalOpen}
      />
    </>
  );
}

export default ObjectiveTable;
