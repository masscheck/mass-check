// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

/**
 * Catapult REST API Reference
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.7.15
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { RequestFile } from '../api';
import { FieldDTO } from './fieldDTO';
import { MetadataDTO } from './metadataDTO';
import { MosaicMetadataDTOAllOf } from './mosaicMetadataDTOAllOf';

export class MosaicMetadataDTO {
    'metadataType': number;
    'fields': Array<FieldDTO>;
    'metadataId': Array<number>;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "metadataType",
            "baseName": "metadataType",
            "type": "number"
        },
        {
            "name": "fields",
            "baseName": "fields",
            "type": "Array<FieldDTO>"
        },
        {
            "name": "metadataId",
            "baseName": "metadataId",
            "type": "Array<number>"
        }    ];

    static getAttributeTypeMap() {
        return MosaicMetadataDTO.attributeTypeMap;
    }
}

