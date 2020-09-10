import React, { useState, useEffect } from 'react';
import { getUsers, deleteDepartment } from '../api/apis';
import { Button, PageSection, PaginationVariant } from '@patternfly/react-core';
import { IColumn, Table, PFTable, TablePagination } from '@rh-support/components';
import { ModalType, noResultFoundRow } from '../components/Objectives';
import { TrashIcon, PencilAltIcon } from '@patternfly/react-icons';
// import { KeyResultsModal } from '../components/KeyResultsModal';
import { ReactQueryConstant } from '../models/reactQueryConst';
import { useQuery, useMutation, queryCache } from 'react-query';
import { UsersModal } from '../components/UsersModal';
import { addSuccessMessage, addDangerMessage } from '../utils/alertUtil';
import { isEmpty, slice } from 'lodash';
import { TableVariant } from '@patternfly/react-table';


export function Users() {
  const usersData = useQuery(ReactQueryConstant.USERS, getUsers, {
    staleTime: Infinity
  });
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [modalType, setModalType] = useState(ModalType.CREATE);
  const [filteredDepartment, setFilteredDepartment] = React.useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);

  const [dDepartment] = useMutation(deleteDepartment, {
    onError: () => {
      addDangerMessage('Error in deleting objective.');
    },
    onSuccess: () => {
      addSuccessMessage('Successfully Deleted Objective.');
    },
    onSettled: (data, error) => {
      queryCache.invalidateQueries(ReactQueryConstant.DEPARTMENTS);
    }
  });

  useEffect(() => {
    if (!isEmpty(usersData?.data)) {
        setFilteredDepartment(slice(usersData?.data, 0, 10));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersData?.data]);

  const columns: IColumn[] = [
    {
      title: 'First Name',
      id: 'first_name',
      sortable: true,
      accessor: data => data.firstName
    },
    {
        title: 'Last Name',
        id: 'last_name',
        sortable: true,
        accessor: data => data.lastName
      },
    {
      id: 'actions',
      title: 'Actions',
      cell: data => renderActionButtons(data)
    }
  ];
  const renderActionButtons = data => {
    return (
      <>
        <Button className="p-r-0 p-l-0" variant="plain" aria-label="Action" onClick={event => onEditDepartment(event, data)}>
          <PencilAltIcon />
        </Button>
        <Button
          className="p-r-0 p-l-2"
          variant="plain"
          aria-label="Action"
          onClick={event => onDeleteDepartment(event, data)}
        >
          <TrashIcon />
        </Button>
      </>
    );
  };
  const onDeleteDepartment = async (event, data) => {
    try {
        await dDepartment({ id: data.id });
      } catch (error) {
        console.log('error', error);
      }
  };
  const onEditDepartment = async (event, data) => {
    setIsModalOpen(true);
    setModalType(ModalType.EDIT);
    setSelectedUserData(data);
  };
  const onCreateDepartment = () => {
    setIsModalOpen(true);
    setModalType(ModalType.CREATE);
    setSelectedUserData(null);
  };
  const onSetPage = ({ pageSize, currentPage }) => {
    setFilteredDepartment(slice(usersData?.data, pageSize * (currentPage - 1), pageSize * currentPage));
    setCurrentPage(currentPage);
  };

  const onPerPageSelect = ({ pageSize }) => {
    setFilteredDepartment(slice(usersData?.data, 0, pageSize));
    setCurrentPage(1);
  };
  return (
    <>
      <PageSection>
        <div className="pf-u-text-align-right">
          <Button isSmall className="pf-u-mb-sm" variant="primary" onClick={onCreateDepartment}>
            Create Department
          </Button>
        </div>
        <Table columns={columns} data={filteredDepartment || []}>
          <PFTable
            aria-label="department-table"
            className="department-table"
            pagination={false}
            emptyStateRow={noResultFoundRow}
            variant={TableVariant.compact}
          />
          {(usersData?.data || []).length > 10 && (
            <footer>
              <TablePagination
                variant={PaginationVariant.bottom}
                itemCount={(usersData?.data || []).length}
                perPage={10}
                currentPage={currentPage}
                onSetPage={onSetPage}
                onPerPageSelect={onPerPageSelect}
              />
            </footer>
          )}
        </Table>
      </PageSection>
      <UsersModal
        modalType={modalType}
        usersData={selectedUserData}
        isModalOpen={isModalOpen}
        onCloseModal={() => setIsModalOpen(false)}
      />
    </>
  );
}
