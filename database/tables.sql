--Tables for the DLS XAS Standards database
--Structure kept close to https://github.com/XraySpectroscopy/XASDataLibrary

--\c myappdb
\c xasstandarddb

SET role xasadmin;

--GRANT ALL ON ALL TABLES IN SCHEMA myappdb TO myapp;

CREATE TABLE element (
	z INTEGER NOT NULL,
	name TEXT NOT NULL,
	symbol VARCHAR(2) NOT NULL,
	PRIMARY KEY (z),
	UNIQUE (name),
	UNIQUE (symbol)
);

COMMENT ON TABLE element IS 'Elements of the periodic table';

INSERT INTO "element" VALUES(1,'hydrogen','H');
INSERT INTO "element" VALUES(2,'helium','He');
INSERT INTO "element" VALUES(3,'lithium','Li');
INSERT INTO "element" VALUES(4,'beryllium','Be');
INSERT INTO "element" VALUES(5,'boron','B');
INSERT INTO "element" VALUES(6,'carbon','C');
INSERT INTO "element" VALUES(7,'nitrogen','N');
INSERT INTO "element" VALUES(8,'oxygen','O');
INSERT INTO "element" VALUES(9,'fluorine','F');
INSERT INTO "element" VALUES(10,'neon','Ne');
INSERT INTO "element" VALUES(11,'sodium','Na');
INSERT INTO "element" VALUES(12,'magnesium','Mg');
INSERT INTO "element" VALUES(13,'aluminum','Al');
INSERT INTO "element" VALUES(14,'silicon','Si');
INSERT INTO "element" VALUES(15,'phosphorus','P');
INSERT INTO "element" VALUES(16,'sulfur','S');
INSERT INTO "element" VALUES(17,'chlorine','Cl');
INSERT INTO "element" VALUES(18,'argon','Ar');
INSERT INTO "element" VALUES(19,'potassium','K');
INSERT INTO "element" VALUES(20,'calcium','Ca');
INSERT INTO "element" VALUES(21,'scandium','Sc');
INSERT INTO "element" VALUES(22,'titanium','Ti');
INSERT INTO "element" VALUES(23,'vanadium','V');
INSERT INTO "element" VALUES(24,'chromium','Cr');
INSERT INTO "element" VALUES(25,'manganese','Mn');
INSERT INTO "element" VALUES(26,'iron','Fe');
INSERT INTO "element" VALUES(27,'cobalt','Co');
INSERT INTO "element" VALUES(28,'nickel','Ni');
INSERT INTO "element" VALUES(29,'copper','Cu');
INSERT INTO "element" VALUES(30,'zinc','Zn');
INSERT INTO "element" VALUES(31,'gallium','Ga');
INSERT INTO "element" VALUES(32,'germanium','Ge');
INSERT INTO "element" VALUES(33,'arsenic','As');
INSERT INTO "element" VALUES(34,'selenium','Se');
INSERT INTO "element" VALUES(35,'bromine','Br');
INSERT INTO "element" VALUES(36,'krypton','Kr');
INSERT INTO "element" VALUES(37,'rubidium','Rb');
INSERT INTO "element" VALUES(38,'strontium','Sr');
INSERT INTO "element" VALUES(39,'yttrium','Y');
INSERT INTO "element" VALUES(40,'zirconium','Zr');
INSERT INTO "element" VALUES(41,'niobium','Nb');
INSERT INTO "element" VALUES(42,'molybdenum','Mo');
INSERT INTO "element" VALUES(43,'technetium','Tc');
INSERT INTO "element" VALUES(44,'ruthenium','Ru');
INSERT INTO "element" VALUES(45,'rhodium','Rh');
INSERT INTO "element" VALUES(46,'palladium','Pd');
INSERT INTO "element" VALUES(47,'silver','Ag');
INSERT INTO "element" VALUES(48,'cadmium','Cd');
INSERT INTO "element" VALUES(49,'indium','In');
INSERT INTO "element" VALUES(50,'tin','Sn');
INSERT INTO "element" VALUES(51,'antimony','Sb');
INSERT INTO "element" VALUES(52,'tellurium','Te');
INSERT INTO "element" VALUES(53,'iodine','I');
INSERT INTO "element" VALUES(54,'xenon','Xe');
INSERT INTO "element" VALUES(55,'cesium','Cs');
INSERT INTO "element" VALUES(56,'barium','Ba');
INSERT INTO "element" VALUES(57,'lanthanum','La');
INSERT INTO "element" VALUES(58,'cerium','Ce');
INSERT INTO "element" VALUES(59,'praseodymium','Pr');
INSERT INTO "element" VALUES(60,'neodymium','Nd');
INSERT INTO "element" VALUES(61,'promethium','Pm');
INSERT INTO "element" VALUES(62,'samarium','Sm');
INSERT INTO "element" VALUES(63,'europium','Eu');
INSERT INTO "element" VALUES(64,'gadolinium','Gd');
INSERT INTO "element" VALUES(65,'terbium','Tb');
INSERT INTO "element" VALUES(66,'dysprosium','Dy');
INSERT INTO "element" VALUES(67,'holmium','Ho');
INSERT INTO "element" VALUES(68,'erbium','Er');
INSERT INTO "element" VALUES(69,'thulium','Tm');
INSERT INTO "element" VALUES(70,'ytterbium','Yb');
INSERT INTO "element" VALUES(71,'lutetium','Lu');
INSERT INTO "element" VALUES(72,'hafnium','Hf');
INSERT INTO "element" VALUES(73,'tantalum','Ta');
INSERT INTO "element" VALUES(74,'tungsten','W');
INSERT INTO "element" VALUES(75,'rhenium','Re');
INSERT INTO "element" VALUES(76,'osmium','Os');
INSERT INTO "element" VALUES(77,'iridium','Ir');
INSERT INTO "element" VALUES(78,'platinum','Pt');
INSERT INTO "element" VALUES(79,'gold','Au');
INSERT INTO "element" VALUES(80,'mercury','Hg');
INSERT INTO "element" VALUES(81,'thallium','Tl');
INSERT INTO "element" VALUES(82,'lead','Pb');
INSERT INTO "element" VALUES(83,'bismuth','Bi');
INSERT INTO "element" VALUES(84,'polonium','Po');
INSERT INTO "element" VALUES(85,'astatine','At');
INSERT INTO "element" VALUES(86,'radon','Rn');
INSERT INTO "element" VALUES(87,'francium','Fr');
INSERT INTO "element" VALUES(88,'radium','Ra');
INSERT INTO "element" VALUES(89,'actinium','Ac');
INSERT INTO "element" VALUES(90,'thorium','Th');
INSERT INTO "element" VALUES(91,'protactinium','Pa');
INSERT INTO "element" VALUES(92,'uranium','U');
INSERT INTO "element" VALUES(93,'neptunium','Np');
INSERT INTO "element" VALUES(94,'plutonium','Pu');
INSERT INTO "element" VALUES(95,'americium','Am');
INSERT INTO "element" VALUES(96,'curium','Cm');
INSERT INTO "element" VALUES(97,'berkelium','Bk');
INSERT INTO "element" VALUES(98,'californium','Cf');
INSERT INTO "element" VALUES(99,'einsteinium','Es');
INSERT INTO "element" VALUES(100,'fermium','Fm');
INSERT INTO "element" VALUES(101,'mendelevium','Md');
INSERT INTO "element" VALUES(102,'nobelium','No');
INSERT INTO "element" VALUES(103,'lawerencium','Lw');
INSERT INTO "element" VALUES(104,'rutherfordium','Rf');
INSERT INTO "element" VALUES(105,'dubnium','Ha');
INSERT INTO "element" VALUES(106,'seaborgium','Sg');
INSERT INTO "element" VALUES(107,'bohrium','Bh');
INSERT INTO "element" VALUES(108,'hassium','Hs');
INSERT INTO "element" VALUES(109,'meitnerium','Mt');
INSERT INTO "element" VALUES(110,'darmstadtium','Ds');
INSERT INTO "element" VALUES(111,'roentgenium','Rg');
INSERT INTO "element" VALUES(112,'copernicium','Cn');

CREATE TABLE edge (
	id INTEGER NOT NULL,
	name TEXT NOT NULL,
	level VARCHAR(32) NOT NULL,
	PRIMARY KEY (id),
	UNIQUE (name),
	UNIQUE (level)
);

COMMENT ON TABLE edge IS 'Description of the transition associated with an absorption edge';

INSERT INTO "edge" VALUES(1,'K','1s');
INSERT INTO "edge" VALUES(2,'L3','2p3/2');
INSERT INTO "edge" VALUES(3,'L2','2p1/2');
INSERT INTO "edge" VALUES(4,'L1','2s');
INSERT INTO "edge" VALUES(5,'M4,5','3d3/2,5/2');


CREATE TABLE facility (
	id INTEGER NOT NULL,
	name TEXT NOT NULL,
	notes TEXT,
	fullname TEXT,
	laboratory TEXT,
	city TEXT,
	region TEXT,
	country TEXT NOT NULL,
	PRIMARY KEY (id),
	UNIQUE (name)
);

COMMENT ON TABLE facility IS 'Facility at which the measurement was taken';

INSERT INTO "facility" VALUES(1,'SSRL',NULL,'Stanford Synchrotron Radiation Laboratory','SLAC','Palo Alto','CA','US');
INSERT INTO "facility" VALUES(2,'SRS',NULL,'Synchrotron Radiation Source','Daresbury Laboratory','Cheshire','','UK');
INSERT INTO "facility" VALUES(3,'NSLS',NULL,'National Synchrotron Light Source','BNL','Upton','NY','US');
INSERT INTO "facility" VALUES(4,'PF',NULL,'Photon Factory','KEK','Tsukuba','','Japan');
INSERT INTO "facility" VALUES(5,'ESRF',NULL,'European Synchrotron Radiation Facility','','Grenoble','','France');
INSERT INTO "facility" VALUES(6,'APS',NULL,'Advanced Photon Source','ANL','Argonne','IL','US');
INSERT INTO "facility" VALUES(7,'ALS',NULL,'Advanced Light Source','LBNL','Berkeley','CA','US');
INSERT INTO "facility" VALUES(8,'DLS',NULL,'Diamond Light Source','','Didcot','','UK');
INSERT INTO "facility" VALUES(9,'SOLEIL',NULL,'Synchrotron SOLEIL','','GIF-sur-YVETTE','','France');

CREATE TABLE beamline (
	id INTEGER NOT NULL,
	name TEXT NOT NULL,
	notes TEXT,
	xray_source TEXT,
	facility_id INTEGER,
	PRIMARY KEY (id),
	UNIQUE (name),
	FOREIGN KEY(facility_id) REFERENCES facility (id)
);

COMMENT ON TABLE beamline IS 'Beamline at which the measurement was taken';

INSERT INTO "beamline" VALUES(1,'13ID','GSECARS 13-ID','APS Undulator A',6);
INSERT INTO "beamline" VALUES(2,'13BM','GSECARS 13-BM','APS bending magnet',6);
INSERT INTO "beamline" VALUES(3,'10ID','MR-CAT  10-ID','APS Undulator A',6);
INSERT INTO "beamline" VALUES(4,'10BM','MR-CAT  10-BM','APS Bending Magnet',6);
INSERT INTO "beamline" VALUES(5,'20ID','PNC/XOR 20-ID','APS Undulator A',6);
INSERT INTO "beamline" VALUES(6,'20BM','PNC/XOR 20-BM','APS Bending Magnet',6);
INSERT INTO "beamline" VALUES(7,'X11A','NSLS X11-A','NSLS bending magnet',3);
INSERT INTO "beamline" VALUES(8,'2-3','SSRL, 2-3','',1);
INSERT INTO "beamline" VALUES(9,'4-3','SSRL, 4-3','',1);
INSERT INTO "beamline" VALUES(10,'4-1','SSRL, 4-1','',1);
INSERT INTO "beamline" VALUES(11,'B18','General purpose XAS beamline','B18 Bending Magnet', 8);
INSERT INTO "beamline" VALUES(12,'I18','The Microfocus Beamline','I18 Undulator', 8);
INSERT INTO "beamline" VALUES(13,'I20-scanning','Versatile X-ray Spectroscopy','I20 Wiggler', 8);

CREATE TABLE person (
	id SERIAL,
	identifier TEXT NOT NULL,
	PRIMARY KEY (id),
	UNIQUE (identifier)
);

COMMENT ON TABLE person IS 'Table to store unique identifier of user';

CREATE TABLE xas_standard_data (
    id SERIAL,
	original_filename TEXT NOT NULL,
    transmission BOOLEAN NOT NULL,
    fluorescence BOOLEAN NOT NULL,
    reference BOOLEAN NOT NULL,
    location TEXT NOT NULL,
	PRIMARY KEY (id)
);

COMMENT ON TABLE xas_standard_data IS 'Data file storing the standard data';

CREATE TYPE review_status_enum AS ENUM('pending', 'approved', 'rejected');
CREATE TYPE licence_enum AS ENUM('cc_by', 'cc_0', 'logged_in_only');

CREATE Table xas_standard (
    id SERIAL,
    submitter_id INTEGER NOT NULL,
    reviewer_id INTEGER,
    submission_date TIMESTAMP,
    collection_date TIMESTAMP,
    data_id INTEGER,
    review_status review_status_enum,
    reviewer_comments TEXT,
    doi TEXT,
    element_z INTEGER,
    edge_id INTEGER,
    sample_name TEXT,
    sample_prep TEXT,
    beamline_id INTEGER,
    mono_name TEXT,
    mono_dspacing TEXT,
    additional_metadata TEXT,
    licence licence_enum NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(submitter_id) REFERENCES person (id),
    FOREIGN KEY(reviewer_id) REFERENCES person (id),
    FOREIGN KEY(data_id) REFERENCES xas_standard_data (id),
    FOREIGN KEY(element_z) REFERENCES element (z),
    FOREIGN KEY(edge_id) REFERENCES edge (id),
    FOREIGN KEY(beamline_id) REFERENCES beamline (id)
);

COMMENT ON TABLE xas_standard IS 'Metadata relating to an xas standard measurement';

CREATE Table xas_standard_attachment (
    id SERIAL,
    xas_standard_id INTEGER NOT NULL,
    location TEXT NOT NULL,
    description TEXT,
    PRIMARY KEY (id),
    FOREIGN KEY(xas_standard_id) REFERENCES xas_standard (id)
);

COMMENT ON TABLE xas_standard_attachment IS 'File attachments relating to an xas standard measurement';


