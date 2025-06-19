// IndexedDB service for storing and retrieving journal entries

const DB_NAME = 'journalDB';
const DB_VERSION = 1;
const STORE_NAME = 'entries';

class JournalDB {
  constructor() {
    this.db = null;
    this.initDB();
  }

  initDB() {
    return new Promise((resolve, reject) => {
      // Open or create the database
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      // Handle database upgrade or creation
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object store for entries if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { 
            keyPath: 'id',
            autoIncrement: true 
          });
          
          // Create indexes for common queries
          store.createIndex('date', 'date', { unique: false });
          store.createIndex('tag', 'tag', { unique: false });
          store.createIndex('moodValue', 'moodValue', { unique: false });
        }
      };

      // Handle successful database opening
      request.onsuccess = (event) => {
        this.db = event.target.result;
        console.log('IndexedDB initialized successfully');
        resolve();
      };

      // Handle errors
      request.onerror = (event) => {
        console.error('Error initializing IndexedDB', event.target.error);
        reject(event.target.error);
      };
    });
  }

  // Add a new entry
  async addEntry(entry) {
    if (!this.db) {
      await this.initDB(); // Make sure the database is initialized
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(entry);

      request.onsuccess = (event) => {
        // Return the ID of the newly added entry
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        console.error('Error adding entry to IndexedDB', event.target.error);
        reject(event.target.error);
      };
    });
  }

  // Get all entries
  async getAllEntries() {
    if (!this.db) {
      await this.initDB(); // Make sure the database is initialized
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = (event) => {
        // Sort by date (newest first)
        const entries = event.target.result.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        resolve(entries);
      };

      request.onerror = (event) => {
        console.error('Error getting entries from IndexedDB', event.target.error);
        reject(event.target.error);
      };
    });
  }

  // Get entries by tag
  async getEntriesByTag(tag) {
    if (!this.db) {
      await this.initDB();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('tag');
      const request = index.getAll(tag);

      request.onsuccess = (event) => {
        const entries = event.target.result.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        resolve(entries);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  // Delete an entry by ID
  async deleteEntry(id) {
    if (!this.db) {
      await this.initDB();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  // Update an existing entry
  async updateEntry(entry) {
    if (!this.db) {
      await this.initDB();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(entry);

      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }
}

// Export a singleton instance
const journalDB = new JournalDB();
export default journalDB;
