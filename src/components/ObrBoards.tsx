import React from 'react';
import { ObrBoardsTable } from './ObrBoardsTable';
import { useQuery } from 'react-query';
import { getKeyResult } from '../api/apis';
import { keys, groupBy, map, flatten } from 'lodash';
import { Container, Row, Col } from 'react-bootstrap';

// https://diogofcunha.github.io/react-virtualized-tree/#/examples/large-collection
export function ObrBoards() {
  const { data } = useQuery('getAllKeyResults', getKeyResult);
  const d = groupBy(data, 'objective.id');

  const key = keys(d);
  const finalT = flatten(
    map(key, k => {
      const keyData = d[k];
      return map(keyData, kd => {
        const { objective, ...rest } = kd;
        return {
          ...objective,
          subRows: [{ ...rest }]
        };
      });
    })
  );
  return (
    <div>
      <Container className="mt-4">
        <Row className="justify-content-md-center">
          <Col md={12}>
            <ObrBoardsTable tableData={finalT} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
