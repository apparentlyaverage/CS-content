"""
CS202 - Practical 2: CRUD, Advanced Queries & Aggregation Pipelines
Theme: E-commerce (products, users, orders)

This app connects to a MongoDB Atlas cluster and provides a terminal menu
to exercise:
    - Basic CRUD (Create, Read, Update, Delete)
    - Advanced querying ($and, $or, $not, $gt, $lt, $in, $exists)
    - Array operations ($push, $pull, $all, $size)
    - Aggregation pipelines ($match, $group, $project, $sort, $unwind)

Collections used (populated by Dataset_Creation_Scripts/ecommerce_dataset.py):
    - products : { _id, name, description, price, category, tags,
                   features, reviews[], variants[] }
    - users    : { _id, name, email, address, order_history[], payment_methods[] }
    - orders   : { _id, user_id, order_date, total_amount, items[],
                   shipping_address, status_history[] }
"""

import os
import pprint
from bson import ObjectId
from bson.errors import InvalidId
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, PyMongoError

pp = pprint.PrettyPrinter(indent=2)

# -------------------------------------------------------------------
# Database connection
# -------------------------------------------------------------------
# Best practice: keep the real URI out of source control. You can either
# set the MONGO_URI environment variable, or paste your connection string
# directly into the string below for local testing.
#
#   export MONGO_URI="mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority"
#
MONGO_URI = os.environ.get(
    "MONGO_URI",
    "mongodb+srv://g25m5071_db_user:<Jasmine11**>@cluster0.01jg9la.mongodb.net/?appName=Cluster0",
)
DB_NAME = "ecommerce_db"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

products = db["products"]
users = db["users"]
orders = db["orders"]


def verify_connection():
    """Ping the cluster to confirm the connection is alive."""
    try:
        client.admin.command("ping")
        print(f"Connected to MongoDB Atlas. Using database '{DB_NAME}'.")
        return True
    except ConnectionFailure as e:
        print(f"Could not connect to MongoDB: {e}")
        return False


# -------------------------------------------------------------------
# Helpers
# -------------------------------------------------------------------

def to_object_id(id_str):
    """Safely convert a string to an ObjectId, returning None on failure."""
    try:
        return ObjectId(id_str)
    except (InvalidId, TypeError):
        print("That doesn't look like a valid ObjectId.")
        return None


def print_documents(cursor, limit=None):
    """Pretty-print a cursor of documents, optionally capped at `limit`."""
    count = 0
    for doc in cursor:
        pp.pprint(doc)
        print("-" * 40)
        count += 1
        if limit and count >= limit:
            break
    if count == 0:
        print("No documents found.")
    else:
        print(f"({count} document(s) shown)")


# -------------------------------------------------------------------
# CREATE (C)
# -------------------------------------------------------------------

def insert_single_document(collection, document):
    """Insert a single document into the given collection."""
    try:
        result = collection.insert_one(document)
        print(f"Inserted 1 document with _id: {result.inserted_id}")
        return result.inserted_id
    except PyMongoError as e:
        print(f"Insert failed: {e}")
        return None


def insert_multiple_documents(collection, documents):
    """Insert multiple documents into the given collection."""
    try:
        result = collection.insert_many(documents)
        print(f"Inserted {len(result.inserted_ids)} documents.")
        return result.inserted_ids
    except PyMongoError as e:
        print(f"Bulk insert failed: {e}")
        return []


# -------------------------------------------------------------------
# READ (R)
# -------------------------------------------------------------------

def read_all_documents(collection, limit=20):
    """Fetch and print all documents in a collection (capped for readability)."""
    cursor = collection.find()
    print_documents(cursor, limit=limit)


def read_first_document(collection):
    """Print the first document in a collection."""
    doc = collection.find_one()
    if doc:
        pp.pprint(doc)
    else:
        print("Collection is empty.")
    return doc


def read_document_by_id(collection, id_str):
    """Find a single document by its _id."""
    oid = to_object_id(id_str)
    if oid is None:
        return None
    doc = collection.find_one({"_id": oid})
    if doc:
        pp.pprint(doc)
    else:
        print("No document found with that _id.")
    return doc


def read_documents_by_condition(collection, condition, limit=20):
    """Find documents matching a simple condition, e.g. {'category': 'Electronics'}."""
    cursor = collection.find(condition)
    print_documents(cursor, limit=limit)


# -------------------------------------------------------------------
# UPDATE (U)
# -------------------------------------------------------------------

def update_single_document(collection, filter_query, update_fields):
    """Update a single document using the $set operator."""
    try:
        result = collection.update_one(filter_query, {"$set": update_fields})
        print(f"Matched {result.matched_count}, modified {result.modified_count}.")
        return result
    except PyMongoError as e:
        print(f"Update failed: {e}")
        return None


def update_multiple_documents(collection, filter_query, update_fields):
    """Update all documents matching a filter using the $set operator."""
    try:
        result = collection.update_many(filter_query, {"$set": update_fields})
        print(f"Matched {result.matched_count}, modified {result.modified_count}.")
        return result
    except PyMongoError as e:
        print(f"Update failed: {e}")
        return None


# -------------------------------------------------------------------
# DELETE (D)
# -------------------------------------------------------------------

def delete_single_document(collection, filter_query):
    """Delete the first document matching a filter."""
    try:
        result = collection.delete_one(filter_query)
        print(f"Deleted {result.deleted_count} document.")
        return result
    except PyMongoError as e:
        print(f"Delete failed: {e}")
        return None


def delete_multiple_documents(collection, filter_query):
    """Delete all documents matching a filter."""
    try:
        result = collection.delete_many(filter_query)
        print(f"Deleted {result.deleted_count} document(s).")
        return result
    except PyMongoError as e:
        print(f"Delete failed: {e}")
        return None


# -------------------------------------------------------------------
# ADVANCED QUERYING - Logical operators ($and, $or, $not)
# -------------------------------------------------------------------

def find_electronics_under_price(max_price=200):
    """
    $and example:
    Products that are in the 'Electronics' category AND cost less than max_price.
    """
    query = {"$and": [{"category": "Electronics"}, {"price": {"$lt": max_price}}]}
    print(f"Products in Electronics under ${max_price}:")
    print_documents(products.find(query))


def find_products_in_categories_or_cheap(categories, max_price=50):
    """
    $or example:
    Products that are in one of the given categories OR cost less than max_price.
    """
    query = {"$or": [{"category": {"$in": categories}}, {"price": {"$lt": max_price}}]}
    print(f"Products in {categories} OR under ${max_price}:")
    print_documents(products.find(query))


def find_products_not_in_category(category):
    """
    $not example:
    Products whose category does NOT equal the given category.
    """
    query = {"category": {"$not": {"$eq": category}}}
    print(f"Products NOT in category '{category}':")
    print_documents(products.find(query))


# -------------------------------------------------------------------
# ADVANCED QUERYING - Comparison & element operators
# -------------------------------------------------------------------

def find_products_price_range(min_price, max_price):
    """$gt / $lt example: products priced strictly between min_price and max_price."""
    query = {"price": {"$gt": min_price, "$lt": max_price}}
    print(f"Products priced between ${min_price} and ${max_price}:")
    print_documents(products.find(query))


def find_products_in_category_list(category_list):
    """$in example: products whose category is one of category_list."""
    query = {"category": {"$in": category_list}}
    print(f"Products in categories {category_list}:")
    print_documents(products.find(query))


def find_products_with_field(field_name, exists=True):
    """$exists example: products that do/don't have a given field."""
    query = {field_name: {"$exists": exists}}
    print(f"Products where '{field_name}' exists = {exists}:")
    print_documents(products.find(query))


# -------------------------------------------------------------------
# ARRAY FUNCTIONS
# -------------------------------------------------------------------

def add_tag_to_product(product_id_str, tag):
    """$push example: add a new tag to a product's tags array."""
    oid = to_object_id(product_id_str)
    if oid is None:
        return None
    result = products.update_one({"_id": oid}, {"$push": {"tags": tag}})
    print(f"Matched {result.matched_count}, modified {result.modified_count}.")
    return result


def remove_tag_from_product(product_id_str, tag):
    """$pull example: remove a tag from a product's tags array."""
    oid = to_object_id(product_id_str)
    if oid is None:
        return None
    result = products.update_one({"_id": oid}, {"$pull": {"tags": tag}})
    print(f"Matched {result.matched_count}, modified {result.modified_count}.")
    return result


def find_products_with_all_tags(tag_list):
    """$all example: products whose tags array contains ALL of tag_list."""
    query = {"tags": {"$all": tag_list}}
    print(f"Products containing all tags {tag_list}:")
    print_documents(products.find(query))


def find_products_by_review_count(count):
    """$size example: products with exactly `count` reviews."""
    query = {"reviews": {"$size": count}}
    print(f"Products with exactly {count} review(s):")
    print_documents(products.find(query))


# -------------------------------------------------------------------
# AGGREGATION PIPELINES
# -------------------------------------------------------------------

def aggregate_average_rating_per_product(limit=10):
    """
    Pipeline 1: Average rating per product.
    Stages: $match -> $unwind -> $group -> $project -> $sort
    """
    pipeline = [
        {"$match": {"reviews.0": {"$exists": True}}},          # only products with reviews
        {"$unwind": "$reviews"},                                # one doc per review
        {
            "$group": {
                "_id": "$_id",
                "product_name": {"$first": "$name"},
                "average_rating": {"$avg": "$reviews.rating"},
                "review_count": {"$sum": 1},
            }
        },
        {
            "$project": {
                "_id": 0,
                "product_name": 1,
                "average_rating": {"$round": ["$average_rating", 2]},
                "review_count": 1,
            }
        },
        {"$sort": {"average_rating": -1}},
        {"$limit": limit},
    ]
    print(f"Top {limit} products by average rating:")
    print_documents(products.aggregate(pipeline))


def aggregate_total_spent_per_user(limit=10):
    """
    Pipeline 2: Total amount spent per user, using only orders that have
    shipped or been delivered.
    Stages: $match -> $group -> $project -> $sort
    """
    pipeline = [
        {"$match": {"total_amount": {"$gt": 0}}},
        {
            "$group": {
                "_id": "$user_id",
                "orders_count": {"$sum": 1},
                "total_spent": {"$sum": "$total_amount"},
            }
        },
        {
            "$project": {
                "_id": 0,
                "user_id": "$_id",
                "orders_count": 1,
                "total_spent": {"$round": ["$total_spent", 2]},
            }
        },
        {"$sort": {"total_spent": -1}},
        {"$limit": limit},
    ]
    print(f"Top {limit} users by total amount spent:")
    print_documents(orders.aggregate(pipeline))


def aggregate_products_per_category():
    """
    Bonus pipeline: Count of products per category, cheapest -> priciest average.
    Stages: $group -> $project -> $sort
    """
    pipeline = [
        {
            "$group": {
                "_id": "$category",
                "product_count": {"$sum": 1},
                "avg_price": {"$avg": "$price"},
            }
        },
        {
            "$project": {
                "_id": 0,
                "category": "$_id",
                "product_count": 1,
                "avg_price": {"$round": ["$avg_price", 2]},
            }
        },
        {"$sort": {"avg_price": 1}},
    ]
    print("Product count and average price per category:")
    print_documents(products.aggregate(pipeline))


# -------------------------------------------------------------------
# Terminal Menu
# -------------------------------------------------------------------

def prompt_float(msg):
    try:
        return float(input(msg))
    except ValueError:
        print("Invalid number, defaulting to 0.")
        return 0.0


def prompt_int(msg):
    try:
        return int(input(msg))
    except ValueError:
        print("Invalid number, defaulting to 0.")
        return 0


def menu():
    while True:
        print("\n===================== CS202 E-commerce DB Menu =====================")
        print(" -- CRUD --")
        print(" 1.  Insert a single product")
        print(" 2.  Insert multiple products")
        print(" 3.  Read all products (first 20)")
        print(" 4.  Read first product in collection")
        print(" 5.  Find product by _id")
        print(" 6.  Find products by simple condition (category)")
        print(" 7.  Update a single product ($set)")
        print(" 8.  Update multiple products matching a filter ($set)")
        print(" 9.  Delete a single product by _id")
        print(" 10. Delete multiple products matching a filter")
        print(" -- Advanced Queries --")
        print(" 11. $and: Electronics under a given price")
        print(" 12. $or: products in category list OR under a given price")
        print(" 13. $not: products NOT in a given category")
        print(" 14. $gt/$lt: products within a price range")
        print(" 15. $in: products in a list of categories")
        print(" 16. $exists: products with/without a given field")
        print(" -- Array Functions --")
        print(" 17. $push: add a tag to a product")
        print(" 18. $pull: remove a tag from a product")
        print(" 19. $all: products containing all given tags")
        print(" 20. $size: products with an exact number of reviews")
        print(" -- Aggregation Pipelines --")
        print(" 21. Average rating per product (top N)")
        print(" 22. Total amount spent per user (top N)")
        print(" 23. Product count & avg price per category")
        print(" 0.  Exit")
        print("======================================================================")

        choice = input("Enter choice: ").strip()

        if choice == "1":
            name = input("Product name: ")
            category = input("Category: ")
            price = prompt_float("Price: ")
            insert_single_document(
                products,
                {"name": name, "category": category, "price": price, "tags": [], "reviews": []},
            )

        elif choice == "2":
            n = prompt_int("How many products to insert? ")
            docs = []
            for i in range(n):
                name = input(f"  [{i+1}] Product name: ")
                category = input(f"  [{i+1}] Category: ")
                price = prompt_float(f"  [{i+1}] Price: ")
                docs.append({"name": name, "category": category, "price": price, "tags": [], "reviews": []})
            insert_multiple_documents(products, docs)

        elif choice == "3":
            read_all_documents(products)

        elif choice == "4":
            read_first_document(products)

        elif choice == "5":
            pid = input("Product _id: ")
            read_document_by_id(products, pid)

        elif choice == "6":
            category = input("Category to search for: ")
            read_documents_by_condition(products, {"category": category})

        elif choice == "7":
            pid = input("Product _id to update: ")
            oid = to_object_id(pid)
            if oid:
                field = input("Field to update: ")
                value = input("New value: ")
                update_single_document(products, {"_id": oid}, {field: value})

        elif choice == "8":
            category = input("Update all products in category: ")
            field = input("Field to update: ")
            value = input("New value: ")
            update_multiple_documents(products, {"category": category}, {field: value})

        elif choice == "9":
            pid = input("Product _id to delete: ")
            oid = to_object_id(pid)
            if oid:
                delete_single_document(products, {"_id": oid})

        elif choice == "10":
            category = input("Delete all products in category: ")
            delete_multiple_documents(products, {"category": category})

        elif choice == "11":
            max_price = prompt_float("Max price: ")
            find_electronics_under_price(max_price)

        elif choice == "12":
            cats = input("Categories (comma-separated): ").split(",")
            cats = [c.strip() for c in cats if c.strip()]
            max_price = prompt_float("Or under price: ")
            find_products_in_categories_or_cheap(cats, max_price)

        elif choice == "13":
            category = input("Category to exclude: ")
            find_products_not_in_category(category)

        elif choice == "14":
            lo = prompt_float("Min price: ")
            hi = prompt_float("Max price: ")
            find_products_price_range(lo, hi)

        elif choice == "15":
            cats = input("Categories (comma-separated): ").split(",")
            cats = [c.strip() for c in cats if c.strip()]
            find_products_in_category_list(cats)

        elif choice == "16":
            field = input("Field name: ")
            exists_input = input("Should it exist? (y/n): ").strip().lower()
            find_products_with_field(field, exists=(exists_input == "y"))

        elif choice == "17":
            pid = input("Product _id: ")
            tag = input("Tag to add: ")
            add_tag_to_product(pid, tag)

        elif choice == "18":
            pid = input("Product _id: ")
            tag = input("Tag to remove: ")
            remove_tag_from_product(pid, tag)

        elif choice == "19":
            tags = input("Tags to require, comma-separated: ").split(",")
            tags = [t.strip() for t in tags if t.strip()]
            find_products_with_all_tags(tags)

        elif choice == "20":
            n = prompt_int("Exact number of reviews: ")
            find_products_by_review_count(n)

        elif choice == "21":
            n = prompt_int("Show top N products: ")
            aggregate_average_rating_per_product(limit=n if n > 0 else 10)

        elif choice == "22":
            n = prompt_int("Show top N users: ")
            aggregate_total_spent_per_user(limit=n if n > 0 else 10)

        elif choice == "23":
            aggregate_products_per_category()

        elif choice == "0":
            print("Exiting...")
            client.close()
            break

        else:
            print("Invalid choice, try again.")


if __name__ == "__main__":
    if verify_connection():
        menu()
    else:
        print("Fix your MONGO_URI and try again.")
