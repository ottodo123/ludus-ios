//
//  Item.swift
//  Ludus
//
//  Created by Otto Do on 7/3/25.
//

import Foundation
import SwiftData

@Model
final class Item {
    var timestamp: Date
    
    init(timestamp: Date) {
        self.timestamp = timestamp
    }
}
