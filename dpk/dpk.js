const { getConfig } = require('../config');
const { hashString } = require('../utils/hash');

/**
 * extract a candidate from an event
 * @param event
 * @returns string | number
 */
async function getCandidateFromEvent(event) {
  return (event.partitionKey) ? event.partitionKey : hashString(JSON.stringify(event));
}

/**
 * convert a candidate to string
 * @param candidate 
 * @returns string
 */
async function stringifyTheCandidate(candidate) {
  const config = await getConfig();
  if(!candidate) {
    return config.TRIVIAL_PARTITION_KEY;
  }
  return (typeof candidate !== "string") ? JSON.stringify(candidate) : candidate;
}

/**
 * compress a string representation of a candidate
 * @param candidateStr 
 * @returns string
 */
async function compressCandidateStr(candidateStr) {
  const config = await getConfig();
  return (candidateStr.length > config.MAX_PARTITION_KEY_LENGTH) ? hashString(candidateStr) : candidateStr;
}

/**
 * Extract a deterministic partition key from a Event
 * @param event 
 * @returns string | undefined
 */
async function deterministicPartitionKey(event) {
  if (!event) {
    return undefined;
  }
  const candidate = await getCandidateFromEvent(event);
  const candidateStr = await stringifyTheCandidate(candidate);
  return compressCandidateStr(candidateStr);
};

module.exports = {
  hashString,
  getCandidateFromEvent,
  stringifyTheCandidate,
  compressCandidateStr,
  deterministicPartitionKey
}