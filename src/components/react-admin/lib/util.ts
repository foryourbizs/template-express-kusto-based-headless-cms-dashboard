const convertDatum = (datum: any) => {
  return {
    id: datum.id,
    // type: datum.type, // JSON API의 type 필드는 React Admin에서 불필요하므로 제외
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
      includedDatum.relationships[key] = relationData
        .map((relation) => {
          return includedHash.get(relation.type + relation.id);
        })
        .filter((relation) => {
          return relation;
        });
    } else if (relationData) {
      includedDatum.relationships[key] =
        includedHash.get(relationData.type + relationData.id) ?? null;
    } else if (relationData === null) {
      // include 했지만 relation 이 없는 경우
      includedDatum.relationships[key] = null;
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