import React, { useEffect, useState } from 'react';
import {
  Button,
  EmptyState,
  Bullseye,
  EmptyStateVariant,
  EmptyStateIcon,
  Title,
  PageSection,
  PaginationVariant
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import { IColumn, Table, PFTable, TablePagination } from '@rh-support/components';
import { ObjectiveModal } from '../components/ObjectiveModal';
import { TrashIcon, PencilAltIcon } from '@patternfly/react-icons';
import { useMutation, useQuery, queryCache } from 'react-query';
import { deleteObjective, getObjectives } from '../api/apis';
import { addSuccessMessage, addDangerMessage } from '../utils/alertUtil';
import { slice, isEmpty } from 'lodash';
import { ReactQueryConstant } from '../models/reactQueryConst';

export const noResultFoundRow = [
  {
    heightAuto: true,
    cells: [
      {
        props: {
          colSpan: 8
        },
        title: (
          <Bullseye>
            <EmptyState variant={EmptyStateVariant.small}>
              <EmptyStateIcon icon={SearchIcon} />
              <Title headingLevel="h2" size="lg">
                No results found
              </Title>
            </EmptyState>
          </Bullseye>
        )
      }
    ]
  }
];

export enum ModalType {
  EDIT = 'Edit',
  CREATE = 'Create'
}

export function Objective() {
  const objectiveData = useQuery(ReactQueryConstant.OBJECTIVES, getObjectives, {
    staleTime: Infinity
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dObjective] = useMutation(deleteObjective, {
    onError: () => {
      addDangerMessage('Error in deleting objective.');
    },
    onSuccess: () => {
      addSuccessMessage('Successfully Deleted Objective.');
    },
    onSettled: (data, error) => {
      queryCache.invalidateQueries(ReactQueryConstant.OBJECTIVES);
    }
  });
  const [modalType, setModalType] = useState(ModalType.CREATE);
  const [selectedObjectiveData, setSelectedObjectiveData] = useState(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filteredObjective, setFilteredObjective] = React.useState([]);

  useEffect(() => {
    if (!isEmpty(objectiveData.data)) {
      setFilteredObjective(slice(objectiveData.data, 0, 10));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objectiveData.data]);
  const onCreateObjective = () => {
    setIsModalOpen(true);
  };
  const onDeleteNotes = async (event, data) => {
    try {
      await dObjective({ id: data.id });
    } catch (error) {}
  };
  const onEditNotes = async (event, data) => {
    setIsModalOpen(true);
    setModalType(ModalType.EDIT);
    setSelectedObjectiveData(data);
  };
  const renderActionButtons = data => {
    return (
      <>
        <Button className="p-r-0 p-l-0" variant="plain" aria-label="Action" onClick={event => onEditNotes(event, data)}>
          <PencilAltIcon />
        </Button>
        <Button
          className="p-r-0 p-l-2"
          variant="plain"
          aria-label="Action"
          onClick={event => onDeleteNotes(event, data)}
        >
          <TrashIcon />
        </Button>
      </>
    );
  };
  const columns: IColumn[] = [
    {
      title: 'Title',
      id: 'objective_title',
      sortable: true,
      accessor: data => data.title
    },
    {
      title: 'Description',
      id: 'objective_description',
      sortable: true,
      accessor: data => data.description
    },
    {
      title: 'Start Date',
      id: 'objective_start_date',
      accessor: data => data.startDate
    },
    {
      title: 'End Date',
      id: 'objective_end_date',
      accessor: data => data.endDate
    },
    {
      title: 'Status',
      id: 'objective_status',
      accessor: data => data.status
    },
    {
      id: 'actions',
      title: 'Actions',
      cell: data => renderActionButtons(data)
    }
  ];
  const onSetPage = ({ pageSize, currentPage }) => {
    setFilteredObjective(slice(objectiveData.data, pageSize * (currentPage - 1), pageSize * currentPage));
    setCurrentPage(currentPage);
  };

  const onPerPageSelect = ({ pageSize }) => {
    setFilteredObjective(slice(objectiveData.data, 0, pageSize));
    setCurrentPage(1);
  };

  return (
    <>
      {' '}
      <PageSection>
        <div className="pf-u-text-align-right">
          <Button isSmall className="pf-u-mb-sm" variant="primary" onClick={onCreateObjective}>
            Create Objective
          </Button>
        </div>
        <Table columns={columns} data={filteredObjective}>
          <PFTable
            aria-label="objective-table"
            className="objective-table"
            pagination={false}
            emptyStateRow={noResultFoundRow}
          />
          {(objectiveData.data || []).length > 10 && (
            <footer>
              <TablePagination
                variant={PaginationVariant.bottom}
                itemCount={(objectiveData.data || []).length}
                perPage={10}
                currentPage={currentPage}
                onSetPage={onSetPage}
                onPerPageSelect={onPerPageSelect}
              />
            </footer>
          )}
        </Table>
      </PageSection>{' '}
      <ObjectiveModal
        modalType={modalType}
        objectiveData={selectedObjectiveData}
        isModalOpen={isModalOpen}
        onCloseModal={() => setIsModalOpen(false)}
      />{' '}
    </>
  );
}
