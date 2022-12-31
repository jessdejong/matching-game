from google.cloud import datastore
import datetime

datastore_client = datastore.Client()

def add_short_url_to_db(original_url, hash):
    query = datastore_client.query(kind='url')
    query.add_filter("hash", "=", hash)
    entities_with_hash = list(query.fetch(limit=5))
    print(entities_with_hash)

    if len(entities_with_hash) > 0:
        # delete the entity from the database
        for entity in entities_with_hash:
            datastore_client.delete(entity.key)
    
    entity = datastore.Entity(key=datastore_client.key('url'))
    entity.update({
        'original_url': original_url,
        'hash': hash,
        'timestamp': datetime.datetime.now(), 
        'visits': 0
    })

    datastore_client.put(entity)


def fetch_urls(limit):
    query = datastore_client.query(kind='url')
    query.order = ['-timestamp']

    urls = query.fetch(limit=limit)

    return urls


def get_original_url(hash):
    query = datastore_client.query(kind='url')
    query.add_filter("hash", "=", hash)
    entities_with_hash = list(query.fetch(limit=1))

    print("HERE")
    print(entities_with_hash[0]["original_url"])

    if (len(entities_with_hash) > 0):
        return entities_with_hash[0]["original_url"]
    
    return None


def increment_visit_count(original_url):
    query = datastore_client.query(kind='url')
    query.add_filter("original_url", "=", original_url)
    entities = list(query.fetch(limit=1))

    if (len(entities) > 0):
        entities[0]["visits"] = entities[0]["visits"] + 1
        datastore_client.put(entities[0])