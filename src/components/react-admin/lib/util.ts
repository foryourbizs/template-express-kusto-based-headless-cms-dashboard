const convertDatum = (datum: any) => {
  return {
    id: datum.id,
    type: datum.type, // 추가!
    ...datum.attributes,
  };
};

const convertData = (data: any) => {
  if (Array.isArray(data)) {
    return data.map((datum) => {
      return convertDatum(datum);
    });
  } else {
    return convertDatum(data);
  }
};

const includeConvertedDatum = (
  convertedDatum: any,
  relationships: any[],
  includedHash: Map<string, any>,
) => {
  const includedDatum = convertedDatum;
  includedDatum.relationships = {};
  for (const key in relationships) {
    const relationData = relationships[key].data;
    if (Array.isArray(relationData)) {
      const relatedItems = relationData
        .map((relation) => {
          return includedHash.get(relation.type + relation.id);
        })
        .filter((relation) => {
          return relation;
        });
      includedDatum.relationships[key] = relatedItems;
      // 배열은 relationships 안에만 저장
    } else if (relationData) {
      const relatedItem = includedHash.get(relationData.type + relationData.id) ?? null;
      includedDatum.relationships[key] = relatedItem;
      // 단일 관계는 최상위에도 저장
      includedDatum[key] = relatedItem;
    } else if (relationData === null) {
      includedDatum.relationships[key] = null;
      includedDatum[key] = null;
    }
  }
  return includedDatum;
};

const includeAndConvert = (data: any, included: any[] | undefined) => {
  const includedHash: Map<string, any> = new Map();

  if (included) {
    const convertedIncluded = included.map((data: any) => {
      return convertData(data);
    });
    convertedIncluded.forEach((data: any) => {
      includedHash.set(data.type + data.id, data);
    });

    convertedIncluded.forEach((data: any, index: number) => {
      includeConvertedDatum(data, included[index].relationships, includedHash);
    });
  }

  if (Array.isArray(data)) {
    return data.map((datum) => {
      return includeConvertedDatum(
        convertData(datum),
        datum.relationships,
        includedHash,
      );
    });
  } else {
    return includeConvertedDatum(
      convertData(data),
      data.relationships,
      includedHash,
    );
  }
};

export { convertData, includeAndConvert };