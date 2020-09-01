import React from 'react';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import { Button, Text, TextVariants, Flex, FlexItem, Modal, ModalVariant, TextContent } from '@patternfly/react-core';
import { ColoredChip } from './ColoredChip';
import htmlToImage from 'html-to-image';
import download from 'downloadjs';

interface IProps {
  isModalOpen: boolean;
  onCloseModal: () => void;
  objectiveData: any;
}

export function ViewObjectiveDataModal(props: IProps) {
  const { objectiveData, isModalOpen, onCloseModal } = props;
  if (isEmpty(objectiveData)) {
    return null;
  }

  const findAllChild = (subRows = [], allValues = []) => {
    map(subRows, sR => {
      allValues.push(sR);
      if (!isEmpty(sR.subRows)) {
        findAllChild(sR.subRows, allValues);
      }
    });
  };

  const viewData = () => {
    const allValues = [];
    if (isEmpty(objectiveData)) {
      return null;
    }
    findAllChild(objectiveData.subRows, allValues);
    (allValues || []).sort(function(a, b) {
      return a.isObjective - b.isObjective;
    });
    return (
      <Flex id="objective-data" direction={{ default: 'column' }}>
        <FlexItem className="text-item-center">
          <TextContent>
            <Text component={TextVariants.h1}>{objectiveData.title}</Text>
          </TextContent>
        </FlexItem>
        <FlexItem className="text-item-center text-color-red">{objectiveData.description}</FlexItem>
        <span className="m-t-8">
          {map(allValues, (aValues, index) => (
            <FlexItem key={index} className="m-t-4">
              <Flex className="align-item-center" spaceItems={{ modifier: 'spaceItemsXl' } as any}>
                <FlexItem>{aValues.isObjective ? 'Ob' : `KR${index + 1}`}</FlexItem>
                <FlexItem>{aValues.title}</FlexItem>
                <FlexItem>Status</FlexItem>
                <FlexItem>
                  <ColoredChip className="colored-chip-red" />
                </FlexItem>
              </Flex>
            </FlexItem>
          ))}
        </span>
      </Flex>
    );
  };

  const handleModalToggle = () => {
    onCloseModal();
  };

  const onImageDo = () => {
    htmlToImage.toPng(document.getElementById('objective-data'), { backgroundColor: 'white' }).then(function(dataUrl) {
      download(dataUrl, 'my-node1.png');
    });
  };

  return (
    <Modal
      className="objective-modal"
      title={''}
      isOpen={isModalOpen}
      variant={ModalVariant.large}
      onClose={handleModalToggle}
      actions={[]}
    >
      <>
        <Button className="m-b-5" variant="primary" aria-label="Action" onClick={onImageDo}>
          Export As PNG
        </Button>
        {!isEmpty(objectiveData) && <div>{viewData()}</div>}
      </>
    </Modal>
  );
}
