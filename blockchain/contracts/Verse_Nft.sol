// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

/**
 * @title Verse_Nft
 * @dev NFT representing a Bible verse with artwork and metadata.
 * Each NFT stores information like verse reference, artwork URI, and artist.
 * Optionally, users can add on-chain reflections for spiritual engagement.
 */
contract Verse_Nft is ERC721, ERC721URIStorage, ERC721Pausable, Ownable, ERC721Burnable {
    uint256 private _nextTokenId;

    struct NftMetadata {
        string verseReference;     // e.g. "John 3:16"
        string artworkURI;         // IPFS URI for artwork
        string artistName;         // Artist display name
        string verseText;          // Optional: the full verse text
    }

    struct Reflection {
        uint256 tokenId;    // NFT token this reflection belongs to
        string text;        // Reflection text or IPFS hash
        address author;     // Real author (used for edit/delete permissions)
        bool isAnonymous;     // Whether the reflection should be shown anonymously
    }

    // tokenId → Verse details
    mapping(uint256 => NftMetadata) private verseData;

    // tokenId → reflections (stored as IPFS hashes or short text)
    mapping(uint256 => Reflection[]) private reflections;

    // Does the NFT exist
    mapping(uint256 => bool) private exists;

    event NftMinted(
        address indexed to,
        uint256 indexed tokenId,
        string verseReference,
        string artworkURI
    );

    event ReflectionAdded(
        uint256 indexed tokenId,
        address indexed from,
        string reflectionURIorText
    );

    constructor(address initialOwner, string memory name, string memory symbol) 
        ERC721(name, symbol)
        Ownable(initialOwner) {}

    // --- Owner Controls ---
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // --- Public Functions ---

    function mintNft(
        address to,
        string memory uri,
        string memory verseReference,
        string memory artworkURI,
        string memory artistName,
        string memory verseText
    ) external onlyOwner {
        uint256 tokenId = ++_nextTokenId;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        verseData[tokenId] = NftMetadata({
            verseReference: verseReference,
            artworkURI: artworkURI,
            artistName: artistName,
            verseText: verseText
        });

        exists[tokenId] = true;

        emit NftMinted(to, tokenId, verseReference, artworkURI);
    }

    function transferNft(address to, uint256 tokenId) external {
        safeTransferFrom(msg.sender, to, tokenId);
    }

    function burnNft(uint256 tokenId) external {
        address owner = _ownerOf(tokenId);
        require(_isAuthorized(owner, msg.sender, tokenId), "Not owner nor approved");
        this.burn(tokenId);
    }

    /**
     * @notice Users can attach reflections or short testimonies.
     * @dev could be IPFS hash or a short plaintext string.
     */
    function addReflection(
        uint256 tokenId,
        string calldata reflectionTextOrURI,
        bool anonymity
    ) external {
        //attach reflection to NFT
        require(exists[tokenId], "Nonexistent token");
        reflections[tokenId].push(
            Reflection({
                tokenId: tokenId,
                text: reflectionTextOrURI,
                author: anonymity ? address(0) : msg.sender,
                isAnonymous: anonymity
            })
        );
        emit ReflectionAdded(tokenId, msg.sender, reflectionTextOrURI);
    }

    function getReflections(uint256 tokenId) 
    external 
    view 
    returns (Reflection[] memory) {
        require(exists[tokenId], "Nonexistent token");
        return reflections[tokenId];
    }

    // --- Internal Overrides ---

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Pausable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function burn(uint256 tokenId)
        public
        override(ERC721Burnable)
    {
        delete verseData[tokenId];
        delete reflections[tokenId];
        exists[tokenId] = false;
        super.burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}