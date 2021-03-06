import React, { useState } from 'react';
import {
  Button,
  EmptyState,
  Bullseye,
  EmptyStateVariant,
  EmptyStateIcon,
  Title,
  PageSection
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import { ObjectiveModal } from '../components/ObjectiveModal';
import ObjectiveTable from './ObjectiveTable';
import { KeyResultsModal } from './KeyResultsModal';
import { useQuery } from 'react-query';
import { ReactQueryConstant } from '../models/reactQueryConst';
import { getAllDepartments, getObjectives, getUsers } from '../api/apis';

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
  const [isObjectiveModalOpen, setIsObjectiveModalOpen] = useState(false);
  const [isKeyResultModalOpen, setIsKeyResultModalOpen] = useState(false);
  const [modalType, setModalType] = useState(ModalType.CREATE);
  const [editedData, setEditedData] = useState(null);

  useQuery(ReactQueryConstant.DEPARTMENTS, getAllDepartments, {
    staleTime: Infinity
  });

  useQuery(ReactQueryConstant.USERS, getUsers, {
    staleTime: Infinity
  });

  useQuery(ReactQueryConstant.OBJECTIVES, getObjectives, {
    staleTime: Infinity
  });

  const onCreateObjective = () => {
    setIsObjectiveModalOpen(true);
    setModalType(ModalType.CREATE);
  };

  const onCreateKeyResult = () => {
    setIsKeyResultModalOpen(true);
    setModalType(ModalType.CREATE);
  };

  const onEditData = (data: any, isOpenObjectiveModal: boolean) => {
    console.log('onEditData', data, isOpenObjectiveModal);
    if (isOpenObjectiveModal) {
      setIsObjectiveModalOpen(true);
      setIsKeyResultModalOpen(false);
    } else {
      setIsObjectiveModalOpen(false);
      setIsKeyResultModalOpen(true);
    }
    setModalType(ModalType.EDIT);
    setEditedData(data);
  };

  const onCloseModal = () => {
    setIsObjectiveModalOpen(false);
    setIsKeyResultModalOpen(false);
  }
 
  return (
    <>
      {' '}
      <PageSection>
        <div className="pf-u-text-align-right">
          <Button isSmall className="pf-u-mb-sm m-r-2" variant="primary" onClick={onCreateObjective}>
            Create Objective
          </Button>
          <Button isSmall className="pf-u-mb-sm" variant="primary" onClick={onCreateKeyResult}>
            Create Key Result
          </Button>
        </div>
        <ObjectiveTable onEditData={onEditData} />
      </PageSection>{' '}
      {isObjectiveModalOpen &&
        <ObjectiveModal
        modalType={modalType}
        objectiveData={editedData}
        isModalOpen={isObjectiveModalOpen}
        onCloseModal={onCloseModal}
      />}
      {isKeyResultModalOpen &&
        <KeyResultsModal
        modalType={modalType}
        keyResultData={editedData}
        isModalOpen={isKeyResultModalOpen}
        onCloseModal={onCloseModal}
      />}
    </>
  );
}
