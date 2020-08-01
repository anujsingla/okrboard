import React, { useState } from 'react';
// import { useQuery, useMutation } from 'react-query';
import { getKeyResult } from '../api/apis';
import { Button, PageSection, PaginationVariant } from '@patternfly/react-core';
import { IColumn, Table, PFTable, TablePagination } from '@rh-support/components';
import { ModalType, noResultFoundRow } from '../components/Objectives';
import { TrashIcon, PencilAltIcon } from '@patternfly/react-icons';
import { KeyResultsModal } from '../components/KeyResultsModal';
import { ReactQueryConstant } from '../models/reactQueryConst';
import { useQuery } from 'react-query';

// https://anujsingla.atlassian.net/plugins/servlet/ac/okrplugin_prod/post-install#!/okr-explorer?expandedItems=%5B%2275330-0%22,%2275332-1%22,%2275331-1%22,%2275333-1%22,%2275335-1%22,%2275336-1%22,%2275337-1%22,%2275334-1%22,%2275338-2%22,%2275342-3%22,%2275345-3%22,%2275346-3%22,%2275343-3%22,%2275339-2%22,%2275340-3%22,%2275344-3%22,%2275341-3%22,%220-0%22,%2275347-0%22%5D&assigneeIds=null&intervalId=9914&groupIds=null&gradeId=0&OKRTypeId=3

export function KeyResults() {
  // const workstation = useQuery('getAllDepartments', getAllDepartments);
  // const objective = useQuery('getAllObjective', getObjectives);
  // const [createKResult] = useMutation(createKeyResult, {});
  //   const {
  //     applicationState: { keyResults }
  //   } = useApplicationStateContext();
  const keyResultsData = useQuery(ReactQueryConstant.KEY_RESULTS, getKeyResult, {
    staleTime: Infinity
  });
  console.log('keyResultsData', keyResultsData);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [modalType, setModalType] = useState(ModalType.CREATE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedKeyResultData, setSelectedKeyResultData] = useState(null);

  //   const submitKeyResult = (values: ICreateWorkstation, actions: any) => {
  //     createKResult({
  //       department: find(workstation.data, d => d.id === values.workstationName.value),
  //       description: values.description,
  //       objective: find(objective.data, d => d.id === values.objectiveName.value),
  //       title: values.keyResultTitle,
  //       owner: {
  //         id: 2,
  //         firstName: 'first name',
  //         lastName: 'last name',
  //         departments: [
  //           {
  //             id: 1,
  //             name: 'dummy department',
  //             children: []
  //           }
  //         ]
  //       },
  //       type: {
  //         label: 'percentage',
  //         type: 'percentage'
  //       }
  //     });
  //   };
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
  const onDeleteNotes = async (event, data) => {
    // try {
    //   await dObjective({ id: data.id });
    // } catch (error) {}
  };
  const onEditNotes = async (event, data) => {
    setIsModalOpen(true);
    setModalType(ModalType.EDIT);
    setSelectedKeyResultData(data);
  };
  const onCreateObjective = () => {
    setIsModalOpen(true);
  };
  const onSetPage = ({ pageSize, currentPage }) => {
    // setFilteredObjective(slice(objective, pageSize * (currentPage - 1), pageSize * currentPage));
    setCurrentPage(currentPage);
  };

  const onPerPageSelect = ({ pageSize }) => {
    // setFilteredObjective(slice(objective, 0, pageSize));
    setCurrentPage(1);
  };
  return (
    <>
      <PageSection>
        <div className="pf-u-text-align-right">
          <Button isSmall className="pf-u-mb-sm" variant="primary" onClick={onCreateObjective}>
            Create Key Result
          </Button>
        </div>
        <Table columns={columns} data={keyResultsData?.data || []}>
          <PFTable
            aria-label="objective-table"
            className="objective-table"
            pagination={false}
            emptyStateRow={noResultFoundRow}
          />
          {(keyResultsData.data || []).length > 10 && (
            <footer>
              <TablePagination
                variant={PaginationVariant.bottom}
                itemCount={(keyResultsData.data || []).length}
                perPage={10}
                currentPage={currentPage}
                onSetPage={onSetPage}
                onPerPageSelect={onPerPageSelect}
              />
            </footer>
          )}
        </Table>
      </PageSection>
      <KeyResultsModal
        modalType={modalType}
        keyResultData={selectedKeyResultData}
        isModalOpen={isModalOpen}
        onCloseModal={() => setIsModalOpen(false)}
      />
    </>
  );
}
