import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import find from 'lodash/find';

export const getRows = (objectiveData) => {
    if (isEmpty(objectiveData)) {
        return;
    }
    const rows = [];
    // const childRows = [];
    map(objectiveData ?? [], (obdata, index) => {
      if (isEmpty(obdata?.parent)) {
        const r = {
          ...getCellData(obdata, true),
          ...((!isEmpty(obdata?.children) || !isEmpty(obdata?.keyResults)) && {
            subRows: []
          })
        };
        rows.push(r);
        if (!isEmpty(obdata.children)) {
          getObjectiveChildren(objectiveData, obdata, rows[rows.length - 1].subRows);
        } else if (!isEmpty(obdata?.keyResults)) {
          map(obdata?.keyResults, (kresult) => {
            const keyR = {
              ...getCellData(kresult, false)
            };
            rows[rows.length - 1]?.subRows?.push(keyR);
            // rows.push(keyR);
          });
        }
      }
    });

    //  console.log("rows", rows);
    return rows;
    // this.setState({ rows });
  };

 export const getCellData = (rowD, isObjective) => {
    return {
      ...rowD,
      isObjective: isObjective
    };
  };

  export const getObjectiveChildren = (objectiveData, obdata, subRow) => {
    if (!isEmpty(obdata.children)) {
      map(obdata.children, (cData) => {
        const childData = find(objectiveData, (d) => d.id === cData.id);
        // console.log("childData", childData);
        const childR = {
          ...getCellData(childData, true),
          ...((!isEmpty(childData.children) ||
            !isEmpty(childData.keyResults)) && {
            subRows: []
          })
        };
        subRow.push(childR);
        if (!isEmpty(childData.children)) {
          getObjectiveChildren(objectiveData, childData, subRow[subRow.length - 1].subRows);
        } else if (!isEmpty(childData?.keyResults)) {
          // console.log("subRow", subRow, subRow.subRows, childData.keyResults);
          map(childData?.keyResults, (kresult) => {
            const keyR = {
              ...getCellData(kresult, false)
            };
            subRow[subRow.length - 1]?.subRows?.push(keyR);
            // rows.push(keyR);
          });
        }
      });
    }
  };