-- Create tables
CREATE TABLE Artist (
    ArtistId INTEGER PRIMARY KEY,
    Name TEXT
);

CREATE TABLE Album (
    AlbumId INTEGER PRIMARY KEY,
    Title TEXT,
    ArtistId INTEGER,
    FOREIGN KEY (ArtistId) REFERENCES Artist(ArtistId)
);

CREATE TABLE Track (
    TrackId INTEGER PRIMARY KEY,
    Name TEXT,
    AlbumId INTEGER,
    MediaTypeId INTEGER,
    GenreId INTEGER,
    Composer TEXT,
    Milliseconds INTEGER,
    Bytes INTEGER,
    UnitPrice REAL,
    FOREIGN KEY (AlbumId) REFERENCES Album(AlbumId),
    FOREIGN KEY (MediaTypeId) REFERENCES MediaType(MediaTypeId),
    FOREIGN KEY (GenreId) REFERENCES Genre(GenreId)
);

CREATE TABLE MediaType (
    MediaTypeId INTEGER PRIMARY KEY,
    Name TEXT
);

CREATE TABLE Genre (
    GenreId INTEGER PRIMARY KEY,
    Name TEXT
);

CREATE TABLE Invoice (
    InvoiceId INTEGER PRIMARY KEY,
    CustomerId INTEGER,
    InvoiceDate TEXT,
    BillingAddress TEXT,
    BillingCity TEXT,
    BillingState TEXT,
    BillingCountry TEXT,
    BillingPostalCode TEXT,
    Total REAL,
    FOREIGN KEY (CustomerId) REFERENCES Customer(CustomerId)
);

CREATE TABLE Customer (
    CustomerId INTEGER PRIMARY KEY,
    FirstName TEXT,
    LastName TEXT,
    Company TEXT,
    Address TEXT,
    City TEXT,
    State TEXT,
    Country TEXT,
    PostalCode TEXT,
    Phone TEXT,
    Fax TEXT,
    Email TEXT,
    SupportRepId INTEGER,
    FOREIGN KEY (SupportRepId) REFERENCES Employee(EmployeeId)
);

CREATE TABLE Employee (
    EmployeeId INTEGER PRIMARY KEY,
    LastName TEXT,
    FirstName TEXT,
    Title TEXT,
    ReportsTo INTEGER,
    BirthDate TEXT,
    HireDate TEXT,
    Address TEXT,
    City TEXT,
    State TEXT,
    Country TEXT,
    PostalCode TEXT,
    Phone TEXT,
    Fax TEXT,
    Email TEXT,
    FOREIGN KEY (ReportsTo) REFERENCES Employee(EmployeeId)
);

CREATE TABLE InvoiceLine (
    InvoiceLineId INTEGER PRIMARY KEY,
    InvoiceId INTEGER,
    TrackId INTEGER,
    UnitPrice REAL,
    Quantity INTEGER,
    FOREIGN KEY (InvoiceId) REFERENCES Invoice(InvoiceId),
    FOREIGN KEY (TrackId) REFERENCES Track(TrackId)
);

CREATE TABLE Playlist (
    PlaylistId INTEGER PRIMARY KEY,
    Name TEXT
);

CREATE TABLE PlaylistTrack (
    PlaylistId INTEGER,
    TrackId INTEGER,
    PRIMARY KEY (PlaylistId, TrackId),
    FOREIGN KEY (PlaylistId) REFERENCES Playlist(PlaylistId),
    FOREIGN KEY (TrackId) REFERENCES Track(TrackId)
);

-- Insert sample data
-- Add your INSERT statements here based on the Chinook dataset